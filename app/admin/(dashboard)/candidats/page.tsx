import { createServerSupabase } from "@/lib/supabase/server";
import CandidatRowActions from "@/components/admin/CandidatRowActions";
import CandidatCreateForm from "@/components/admin/CandidatCreateForm";

export default async function AdminCandidatsPage() {
  const supabase = createServerSupabase();
  const { data: candidats } = await supabase
    .from("candidats")
    .select("*, categories(nom)")
    .order("votes_total", { ascending: false });

  const { data: categories } = await supabase.from("categories").select("id, nom").order("nom");

  return (
    <div>
      <h1 className="text-lg font-medium text-admin-text">Candidats</h1>

      <CandidatCreateForm categories={categories ?? []} />

      <div className="bg-white border border-gray-200 rounded-xl mt-4 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-3 py-2">Nom</th>
              <th className="text-left px-3 py-2">Catégorie</th>
              <th className="text-left px-3 py-2">Votes</th>
              <th className="text-left px-3 py-2">Statut</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {(candidats ?? []).map((c: any) => (
              <tr key={c.id} className="border-t border-gray-100">
                <td className="px-3 py-2 text-admin-text">{c.nom}</td>
                <td className="px-3 py-2 text-gray-500">{(c.categories as { nom?: string } | null)?.nom ?? "—"}</td>
                <td className="px-3 py-2 text-gray-500">{c.votes_total.toLocaleString("fr-FR")}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${c.actif ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                    {c.actif ? "Actif" : "Désactivé"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <CandidatRowActions candidatId={c.id} actif={c.actif} />
                </td>
              </tr>
            ))}
            {(candidats ?? []).length === 0 && (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">Aucun candidat pour l&apos;instant.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-gray-400 mt-2">
        Le nombre de votes n&apos;est jamais modifiable ici — il n&apos;évolue qu&apos;via les paiements confirmés (règle 11.4/11.14).
      </p>
    </div>
  );
}
