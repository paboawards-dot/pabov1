import { notFound } from "next/navigation";
import HeaderApp from "@/components/HeaderApp";
import CandidatCard from "@/components/CandidatCard";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function CategoriePage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabase();

  const { data: categorie } = await supabase
    .from("categories")
    .select("*, univers(nom, slug)")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!categorie) return notFound();

  const { data: candidatsCategorie } = await supabase
    .from("candidats")
    .select("*")
    .eq("categorie_id", categorie.id)
    .eq("actif", true)
    .order("votes_total", { ascending: false });

  const universInfo = categorie.univers as unknown as { nom: string; slug: string } | null;

  return (
    <main>
      <HeaderApp backHref={`/univers/${universInfo?.slug}`} breadcrumb={`${universInfo?.nom} > ${categorie.nom}`} />
      <div className="px-4 pt-3 grid grid-cols-2 gap-2.5 pb-4">
        {(candidatsCategorie ?? []).length === 0 && (
          <p className="col-span-2 text-center text-sm text-pabo-muted py-8">
            Aucun candidat pour l&apos;instant dans cette catégorie.
          </p>
        )}
        {(candidatsCategorie ?? []).map((c: any) => (
          <CandidatCard key={c.id} candidat={c} />
        ))}
      </div>
    </main>
  );
}
