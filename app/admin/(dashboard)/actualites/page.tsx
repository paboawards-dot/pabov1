import { createServerSupabase } from "@/lib/supabase/server";
import ActualiteCreateForm from "@/components/admin/ActualiteCreateForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { supprimerActualite } from "@/app/admin/actions";

export default async function AdminActualitesPage() {
  const supabase = createServerSupabase();
  const { data: actualites } = await supabase
    .from("actualites")
    .select("*")
    .order("date_publication", { ascending: false });

  return (
    <div>
      <h1 className="text-lg font-medium text-admin-text">Actualités</h1>

      <ActualiteCreateForm />

      <div className="flex flex-col gap-2 mt-4">
        {(actualites ?? []).map((a: any) => (
          <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-admin-text">{a.titre}</p>
              <p className="text-[11px] text-gray-400">{new Date(a.date_publication).toLocaleDateString("fr-FR")}</p>
            </div>
            <DeleteButton id={a.id} action={supprimerActualite} />
          </div>
        ))}
        {(actualites ?? []).length === 0 && <p className="text-xs text-gray-400">Aucune actualité pour l&apos;instant.</p>}
      </div>
    </div>
  );
}
