import { notFound } from "next/navigation";
import HeaderApp from "@/components/HeaderApp";
import PaiementForm from "@/components/PaiementForm";
import { createServerSupabase } from "@/lib/supabase/server";

const PRIX_VOTE_FCFA = 100;

type Props = {
  params: { slug: string };
  searchParams: { quantite?: string };
};

// Route dédiée (pas une modal) — cf. cahier des charges, Bloc Navigation 3.1 :
// permet de retrouver l'état de la transaction en cas de rafraîchissement pendant
// l'attente de confirmation du paiement.
export default async function PaiementPage({ params, searchParams }: Props) {
  const supabase = createServerSupabase();
  const { data: candidat } = await supabase
    .from("candidats")
    .select("id, slug, nom")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!candidat) return notFound();

  const quantite = Math.max(1, Number(searchParams.quantite ?? 1));
  const total = quantite * PRIX_VOTE_FCFA;

  return (
    <main>
      <HeaderApp backHref={`/candidat/${candidat.slug}`} />

      <div className="px-4 pt-3">
        <div className="p-3.5 bg-pabo-card border border-pabo-border rounded-pabo">
          <p className="text-xs text-pabo-muted">Candidat</p>
          <p className="text-sm text-pabo-cream">{candidat.nom}</p>
          <div className="flex justify-between mt-2.5">
            <span className="text-xs text-pabo-muted">Nombre de votes</span>
            <span className="text-sm text-pabo-cream">{quantite}</span>
          </div>
          <div className="flex justify-between mt-1.5 pt-1.5 border-t border-pabo-border">
            <span className="text-xs text-pabo-muted">Total</span>
            <span className="text-sm font-medium text-pabo-gold">{total.toLocaleString("fr-FR")} fcfa</span>
          </div>
        </div>

        <PaiementForm candidatSlug={candidat.slug} nombreVotes={quantite} />
      </div>
    </main>
  );
}
