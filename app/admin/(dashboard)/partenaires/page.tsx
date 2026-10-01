import { createServerSupabase } from "@/lib/supabase/server";
import PartenaireCreateForm from "@/components/admin/PartenaireCreateForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { supprimerPartenaire } from "@/app/admin/actions";

export default async function AdminPartenairesPage() {
  const supabase = createServerSupabase();
  const { data: partenaires } = await supabase.from("partenaires").select("*").order("ordre_affichage");

  return (
    <div>
      <h1 className="text-lg font-medium text-admin-text">Partenaires</h1>

      <PartenaireCreateForm />

      <div className="flex flex-col gap-2 mt-4">
        {(partenaires ?? []).map((p: any) => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase text-pabo-gold">{p.role}</p>
              <p className="text-sm text-admin-text">{p.nom}</p>
            </div>
            <DeleteButton id={p.id} action={supprimerPartenaire} />
          </div>
        ))}
        {(partenaires ?? []).length === 0 && <p className="text-xs text-gray-400">Aucun partenaire pour l&apos;instant.</p>}
      </div>
    </div>
  );
}
