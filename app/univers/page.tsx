import HeaderApp from "@/components/HeaderApp";
import UniversCard from "@/components/UniversCard";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Onglet "Catégories" de la barre de navigation : liste des univers,
// chacun menant à ses catégories (/univers/[slug]).
export default async function UniversListePage() {
  const supabase = createServerSupabase();
  const { data: univers } = await supabase.from("univers").select("*").order("ordre_affichage");
  const liste = (univers ?? []) as any[];

  return (
    <main>
      <HeaderApp breadcrumb="Catégories" />
      <div className="px-4 pt-3 pb-4">
        {liste.length === 0 ? (
          <p className="text-center text-sm text-pabo-muted py-8">
            Aucune catégorie pour l&apos;instant.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {liste.map((u: any) => (
              <UniversCard key={u.id} univers={u} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
