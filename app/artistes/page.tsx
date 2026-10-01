import HeaderApp from "@/components/HeaderApp";
import ArtistesClient from "@/components/ArtistesClient";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function ArtistesPage() {
  const supabase = createServerSupabase();
  const { data: candidats } = await supabase.from("candidats").select("*").eq("actif", true).order("nom");

  return (
    <main>
      <HeaderApp backHref="/" />
      <ArtistesClient candidats={candidats ?? []} />
    </main>
  );
}
