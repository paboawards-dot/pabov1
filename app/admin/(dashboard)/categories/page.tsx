import { createServerSupabase } from "@/lib/supabase/server";
import CategorieRowActions from "@/components/admin/CategorieRowActions";

export default async function AdminCategoriesPage() {
  const supabase = createServerSupabase();

  const { data: univers } = await supabase.from("univers").select("*").order("ordre_affichage");
  const { data: categories } = await supabase.from("categories").select("*, candidats(count)");

  return (
    <div>
      <h1 className="text-lg font-medium text-admin-text">Univers & catégories</h1>

      <div className="flex flex-col gap-4 mt-4">
        {(univers ?? []).map((u: any) => {
          const categoriesUnivers = (categories ?? []).filter((c: any) => c.univers_id === u.id);
          return (
            <div key={u.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-medium text-admin-text">{u.nom}</p>
              <div className="flex flex-col gap-2 mt-2.5">
                {categoriesUnivers.map((c: any) => (
                  <CategorieRowActions key={c.id} categorie={c} />
                ))}
                {categoriesUnivers.length === 0 && (
                  <p className="text-xs text-gray-400">Aucune catégorie pour cet univers.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
