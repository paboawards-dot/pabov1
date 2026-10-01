import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

// GET /api/votes/statut/[transactionId]
// Expose UNIQUEMENT les champs nécessaires à l'écran Confirmation (statut,
// nombre de votes, nom du candidat) — jamais le téléphone ni la référence
// interne CinetPay. C'est la seule façon dont le frontend "connaît" l'état
// d'un paiement : jamais en lisant la table transactions directement (RLS
// réservée aux admins), toujours via cette route contrôlée.
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { transactionId: string } }) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Le service de vote n'est pas encore activé." },
      { status: 503 }
    );
  }

  const supabase = createAdminClient();

  const { data: transaction } = await supabase
    .from("transactions")
    .select("statut, nombre_votes, montant, candidats(nom, slug)")
    .eq("id", params.transactionId)
    .maybeSingle();

  if (!transaction) {
    return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    statut: transaction.statut,
    nombreVotes: transaction.nombre_votes,
    montant: transaction.montant,
    candidat: transaction.candidats,
  });
}
