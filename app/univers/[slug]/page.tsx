import { notFound } from "next/navigation";
import HeaderApp from "@/components/HeaderApp";
import CategorieTuile from "@/components/CategorieTuile";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function UniversPage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabase();

  const { data: u } = await supabase.from("univers").select("*").eq("slug", params.slug).maybeSingle();
  if (!u) return notFound();

  const { data: categoriesUnivers } = await supabase
    .from("categories")
    .select("*, candidats(count)")
    .eq("univers_id", u.id);

  return (
    <main>
      <HeaderApp backHref="/" breadcrumb={u.nom} />
      <div className="px-4 pt-3 flex flex-col gap-2.5 pb-4">
        {(categoriesUnivers ?? []).map((c: any) => (
          <CategorieTuile
            key={c.id}
            categorie={c}
            nombreCandidats={(c.candidats as unknown as { count: number }[])?.[0]?.count ?? 0}
          />
        ))}
      </div>
    </main>
  );
}
