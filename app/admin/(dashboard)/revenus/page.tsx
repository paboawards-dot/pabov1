import { createServerSupabase } from "@/lib/supabase/server";
import ExportRevenusButton from "@/components/admin/ExportRevenusButton";

export default async function AdminRevenusPage() {
  const supabase = createServerSupabase();

  const { data: categories } = await supabase.from("categories").select("id, nom");
  const { data: transactions } = await supabase
    .from("transactions")
    .select("candidat_id, montant, candidats(categorie_id, nom)")
    .eq("statut", "PROCESSED");

  const parCategorie = (categories ?? []).map((cat: any) => {
    const lignesCat = (transactions ?? []).filter(
      (t: any) => (t.candidats as { categorie_id?: string } | null)?.categorie_id === cat.id
    );
    const total = lignesCat.reduce((sum: number, t: any) => sum + t.montant, 0);
    return {
      categorie: cat.nom,
      revenuTotal: total,
      partVainqueur: Math.round(total * 0.5),
      partOrganisation: Math.round(total * 0.5),
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-lg font-medium text-admin-text">Paiements & revenus</h1>
        <ExportRevenusButton lignes={parCategorie} />
      </div>
      <p className="text-[11px] text-gray-400 mt-1">
        Calculé à partir des transactions confirmées (PROCESSED) uniquement. Le paiement du vainqueur reste physique, sur scène (règle métier 5.1.4).
      </p>

      <div className="bg-white border border-gray-200 rounded-xl mt-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-3 py-2">Catégorie</th>
              <th className="text-left px-3 py-2">Revenu total</th>
              <th className="text-left px-3 py-2">Part vainqueur (50%)</th>
              <th className="text-left px-3 py-2">Part organisation (50%)</th>
            </tr>
          </thead>
          <tbody>
            {parCategorie.map((l: any) => (
              <tr key={l.categorie} className="border-t border-gray-100">
                <td className="px-3 py-2 text-admin-text">{l.categorie}</td>
                <td className="px-3 py-2 text-gray-500">{l.revenuTotal.toLocaleString("fr-FR")} fcfa</td>
                <td className="px-3 py-2 text-gray-500">{l.partVainqueur.toLocaleString("fr-FR")} fcfa</td>
                <td className="px-3 py-2 text-gray-500">{l.partOrganisation.toLocaleString("fr-FR")} fcfa</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
