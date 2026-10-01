import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

// Webhook CinetPay — reçoit la notification de paiement (notify_url).
//
// RAPPEL SÉCURITÉ (règles 11.2/11.3/12.5/12.6/12.15) :
// - On ne fait JAMAIS confiance au statut envoyé dans le corps de la requête.
// - On rappelle systématiquement l'API "payment/check" de CinetPay avec nos
//   propres identifiants pour obtenir le VRAI statut, server-to-server.
// - Traitement idempotent via la fonction Postgres traiter_transaction_reussie
//   (un webhook reçu plusieurs fois ne crédite jamais les votes deux fois).
// Doc CinetPay : https://docs.cinetpay.com/api/1.0-fr/checkout/notification
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Le service de vote n'est pas encore activé." },
      { status: 503 }
    );
  }

  const supabase = createAdminClient();

  // CinetPay poste le corps en x-www-form-urlencoded avec au minimum cpm_trans_id.
  const contentType = req.headers.get("content-type") ?? "";
  let cpmTransId: string | null = null;

  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    cpmTransId = body?.cpm_trans_id ?? null;
  } else {
    const form = await req.formData().catch(() => null);
    cpmTransId = (form?.get("cpm_trans_id") as string) ?? null;
  }

  if (!cpmTransId) {
    return NextResponse.json({ error: "cpm_trans_id manquant" }, { status: 400 });
  }

  // 1. Retrouver la transaction correspondante.
  const { data: transaction } = await supabase
    .from("transactions")
    .select("id, statut, montant")
    .eq("reference_cinetpay", cpmTransId)
    .maybeSingle();

  if (!transaction) {
    return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
  }

  // 2. Idempotence : déjà traitée, on répond 200 sans rien refaire.
  if (transaction.statut === "PROCESSED") {
    return NextResponse.json({ ok: true, note: "Déjà traitée." });
  }

  // 3. Vérification server-to-server auprès de CinetPay (jamais confiance au
  //    webhook seul — c'est la source de vérité, cf. règle 12.5/12.15).
  const checkResponse = await fetch("https://api-checkout.cinetpay.com/v2/payment/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: cpmTransId,
    }),
  }).catch(() => null);

  const checkResult = await checkResponse?.json().catch(() => null);

  // Journalisation systématique de la notification reçue, avant traitement.
  await supabase.from("paiement_webhook_log").insert({
    transaction_id: transaction.id,
    payload_brut: checkResult ?? { erreur: "Pas de réponse de payment/check" },
    signature_valide: !!checkResponse?.ok,
    traite: false,
  });

  if (!checkResponse?.ok || !checkResult?.data) {
    return NextResponse.json({ error: "Vérification CinetPay impossible" }, { status: 502 });
  }

  // 4. Vérifier le montant reçu correspond bien à la transaction (règle 12.13/12.16).
  const montantConfirme = Number(checkResult.data.amount);
  if (montantConfirme !== transaction.montant) {
    await supabase.rpc("marquer_transaction_echouee", { p_transaction_id: transaction.id, p_statut: "FAILED" });
    return NextResponse.json({ error: "Montant incohérent" }, { status: 400 });
  }

  const statutCinetpay = checkResult.data.status; // ex. ACCEPTED, REFUSED, WAITING_FOR_CUSTOMER...

  if (statutCinetpay === "ACCEPTED") {
    // 5. Attribution atomique et idempotente des votes (fonction Postgres dédiée,
    //    seule autorisée à modifier votes_total — règle 11.4/11.14).
    const { error } = await supabase.rpc("traiter_transaction_reussie", { p_transaction_id: transaction.id });
    if (error) {
      return NextResponse.json({ error: "Échec de l'attribution des votes", detail: error.message }, { status: 500 });
    }
    await supabase.from("paiement_webhook_log").update({ traite: true }).eq("transaction_id", transaction.id);
    return NextResponse.json({ ok: true });
  }

  if (statutCinetpay === "WAITING_FOR_CUSTOMER") {
    // Paiement encore en attente de validation par l'utilisateur — ne rien faire,
    // CinetPay renverra une nouvelle notification plus tard (cf. doc CinetPay).
    return NextResponse.json({ ok: true, note: "En attente de validation." });
  }

  // Tout autre statut = échec/refus/annulation.
  await supabase.rpc("marquer_transaction_echouee", { p_transaction_id: transaction.id, p_statut: "FAILED" });
  return NextResponse.json({ ok: true, note: `Paiement non abouti: ${statutCinetpay}` });
}
