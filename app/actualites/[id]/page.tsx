import { notFound } from "next/navigation";
import HeaderApp from "@/components/HeaderApp";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function ActualiteDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase();
  const { data: actualite } = await supabase.from("actualites").select("*").eq("id", params.id).maybeSingle();
  if (!actualite) return notFound();

  return (
    <main>
      <HeaderApp backHref="/actualites" />
      <div className="px-4 pt-3 pb-4">
        {actualite.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={actualite.image_url}
            alt={actualite.titre}
            className="w-full aspect-video object-cover rounded-pabo border border-pabo-border"
          />
        )}
        {actualite.video_url && (
          <video
            src={actualite.video_url}
            controls
            className={`w-full rounded-pabo border border-pabo-border ${actualite.image_url ? "mt-3" : ""}`}
          />
        )}
        <p className="text-[11px] text-pabo-muted mt-3">{new Date(actualite.date_publication).toLocaleDateString("fr-FR")}</p>
        <h1 className="text-lg text-pabo-cream mt-1.5">{actualite.titre}</h1>
        <p className="text-sm text-pabo-muted mt-3 leading-relaxed">{actualite.contenu}</p>
      </div>
    </main>
  );
}
