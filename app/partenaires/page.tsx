import HeaderApp from "@/components/HeaderApp";
import PartenaireCard from "@/components/PartenaireCard";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function PartenairesPage() {
  const supabase = createServerSupabase();
  const { data: partenaires } = await supabase.from("partenaires").select("*").order("ordre_affichage");

  return (
    <main>
      <HeaderApp backHref="/menu" breadcrumb="Partenaires" />
      <div className="px-4 pt-3 flex flex-col gap-2.5 pb-4">
        {(partenaires ?? []).map((p: any) => (
          <PartenaireCard key={p.id} partenaire={p} />
        ))}
        <p className="text-xs text-pabo-muted text-center pt-2">D&apos;autres partenaires seront ajoutés prochainement.</p>
      </div>
    </main>
  );
}
