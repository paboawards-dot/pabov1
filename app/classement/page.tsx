import HeaderApp from "@/components/HeaderApp";
import ClassementClient from "@/components/ClassementClient";
import { createServerSupabase } from "@/lib/supabase/server";
import { Candidat } from "@/lib/types";

export default async function ClassementPage() {
  const supabase = createServerSupabase();

  const { data: categories } = await supabase.from("categories").select("*").order("nom");
  const { data: candidats } = await supabase.from("candidats").select("*").eq("actif", true);

  const candidatsParCategorie: Record<string, Candidat[]> = {};
  (candidats ?? []).forEach((c: any) => {
    if (!candidatsParCategorie[c.categorie_id]) candidatsParCategorie[c.categorie_id] = [];
    candidatsParCategorie[c.categorie_id].push(c);
  });

  return (
    <main>
      <HeaderApp backHref="/" />
      <ClassementClient categories={categories ?? []} candidatsParCategorie={candidatsParCategorie} />
    </main>
  );
}
