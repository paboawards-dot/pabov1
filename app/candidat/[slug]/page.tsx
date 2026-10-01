import { notFound } from "next/navigation";
import { User } from "lucide-react";
import HeaderApp from "@/components/HeaderApp";
import CandidatVoteBlock from "@/components/CandidatVoteBlock";
import { createServerSupabase } from "@/lib/supabase/server";

type Props = { params: { slug: string } };

export default async function CandidatPage({ params }: Props) {
  const supabase = createServerSupabase();

  const { data: candidat } = await supabase
    .from("candidats")
    .select("*, categories(nom, slug)")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!candidat) return notFound();

  const categorie = candidat.categories as unknown as { nom: string; slug: string } | null;

  const { data: classement } = await supabase
    .from("candidats")
    .select("*")
    .eq("categorie_id", candidat.categorie_id)
    .eq("actif", true)
    .order("votes_total", { ascending: false });

  return (
    <main>
      <HeaderApp backHref={`/categorie/${categorie?.slug}`} breadcrumb={categorie?.nom} />

      <div className="px-4 pt-3">
        <div className="aspect-square bg-[#0a0a0a] rounded-pabo border border-pabo-border flex items-center justify-center">
          {candidat.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={candidat.photo_url} alt={candidat.nom} className="w-full h-full object-cover rounded-pabo" />
          ) : (
            <User size={48} className="text-[#4a4a4a]" />
          )}
        </div>

        <div className="text-center mt-3">
          <p className="text-lg font-medium text-pabo-cream">{candidat.nom}</p>
          <p className="text-xs text-pabo-muted mt-0.5">{categorie?.nom}</p>
        </div>

        <p className="text-center text-sm text-pabo-gold mt-2">
          {candidat.votes_total.toLocaleString("fr-FR")} votes
        </p>

        {candidat.video_url && (
          <video
            src={candidat.video_url}
            controls
            className="w-full rounded-pabo border border-pabo-border mt-3"
          />
        )}
      </div>

      <CandidatVoteBlock candidatSlug={candidat.slug} />

      <div className="px-4 mt-4 pb-4">
        <p className="text-[11px] text-pabo-muted mb-2">Classement de la catégorie</p>
        <div className="flex flex-col gap-1.5">
          {(classement ?? []).map((c: any, i: number) => (
            <div key={c.id} className="flex items-center justify-between py-1.5">
              <span className={`text-sm ${i === 0 ? "text-pabo-cream" : "text-pabo-muted"}`}>
                {i + 1}. {c.nom}
              </span>
              <span className={`text-sm ${i === 0 ? "text-pabo-gold font-medium" : "text-pabo-muted"}`}>
                {c.votes_total.toLocaleString("fr-FR")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
