import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

const PRIX_VOTE_FCFA = 100;

// POST /api/votes/creer
// Body attendu : { candidatSlug: string, nombreVotes: number, telephone: string, operateur: "ORANGE"|"MTN"|"MOOV"|"WAVE" }
//
// RAPPEL SÉCURITÉ (cf. règles 11.4/12.13) : le frontend n'envoie QUE le slug du
// candidat et le nombre de votes — jamais un montant. Le montant est toujours
// recalculé ici, côté serveur, à partir du prix unitaire (100 FCFA).
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Le service de vote n'est pas encore activé." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const candidatSlug: string | undefined = body?.candidatSlug;
  const nombreVotes: number = Number(body?.nombreVotes);
  const telephone: string | undefined = body?.telephone;
  const operateur: string | undefined = body?.operateur;

  if (!candidatSlug || !nombreVotes || nombreVotes < 1 || !telephone || !operateur) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 1. Vérifier le candidat, sa catégorie et le concours (règle 5.1.2 : le vote
  //    n'est accepté que si le concours est VOTE_OUVERT et la catégorie non fermée).
  const { data: candidat } = await supabase
    .from("candidats")
    .select("id, actif, categorie_id, categories(id, statut_override, univers_id, univers(concours_id, concours(statut)))")
    .eq("slug", candidatSlug)
    .maybeSingle();

  if (!candidat || !candidat.actif) {
    return NextResponse.json({ error: "Candidat introuvable ou inactif." }, { status: 404 });
  }

  const categorie = candidat.categories as unknown as {
    statut_override: string | null;
    univers: { concours: { statut: string } };
  };

  if (categorie?.statut_override === "FERMEE_MANUELLEMENT") {
    return NextResponse.json({ error: "Cette catégorie n'accepte plus de votes." }, { status: 403 });
  }

  const statutConcours = categorie?.univers?.concours?.statut;
  const voteAutorise = statutConcours === "VOTE_OUVERT" || categorie?.statut_override === "PROLONGATION";
  if (!voteAutorise) {
    return NextResponse.json({ error: "Le vote n'est pas ouvert actuellement." }, { status: 403 });
  }

  // 2. Calculer le montant côté serveur (jamais reçu du frontend tel quel).
  const montant = nombreVotes * PRIX_VOTE_FCFA;
  const transactionId = `PABO-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

  // 3. Créer la transaction en base, statut PENDING.
  const { data: transaction, error: insertError } = await supabase
    .from("transactions")
    .insert({
      candidat_id: candidat.id,
      telephone,
      operateur,
      nombre_votes: nombreVotes,
      montant,
      reference_cinetpay: transactionId,
      statut: "PENDING",
    })
    .select()
    .single();

  if (insertError || !transaction) {
    return NextResponse.json({ error: "Impossible de créer la transaction." }, { status: 500 });
  }

  // 4. Initialiser le paiement auprès de CinetPay.
  // Doc : https://docs.cinetpay.com/api/1.0-fr/checkout/initialisation
  const origin = req.nextUrl.origin;
  const cinetpayResponse = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: transactionId,
      amount: montant,
      currency: "XOF",
      description: `Vote Pabo awards — ${nombreVotes} vote(s)`,
      customer_phone_number: telephone,
      channels: "MOBILE_MONEY",
      notify_url: `${origin}/api/webhook/cinetpay`,
      return_url: `${origin}/confirmation/${transaction.id}`,
      metadata: transaction.id,
    }),
  }).catch(() => null);

  const cinetpayResult = await cinetpayResponse?.json().catch(() => null);

  if (!cinetpayResponse?.ok || cinetpayResult?.code !== "201") {
    // Le paiement n'a pas pu être initié — on marque la transaction en échec.
    await supabase.rpc("marquer_transaction_echouee", { p_transaction_id: transaction.id, p_statut: "FAILED" });
    return NextResponse.json(
      { error: "Impossible d'initier le paiement auprès de CinetPay.", detail: cinetpayResult },
      { status: 502 }
    );
  }

  return NextResponse.json({
    transactionId: transaction.id,
    paymentUrl: cinetpayResult.data.payment_url,
  });
}
