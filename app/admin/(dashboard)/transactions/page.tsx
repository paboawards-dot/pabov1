import { createServerSupabase } from "@/lib/supabase/server";

const STATUTS = ["PENDING", "PAID", "PROCESSED", "FAILED", "CANCELLED", "EXPIRED", "REFUNDED"];

export default async function AdminTransactionsPage({ searchParams }: { searchParams: { statut?: string } }) {
  const supabase = createServerSupabase();
  let query = supabase
    .from("transactions")
    .select("*, candidats(nom)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (searchParams.statut) query = query.eq("statut", searchParams.statut);

  const { data: transactions } = await query;

  return (
    <div>
      <h1 className="text-lg font-medium text-admin-text">Transactions</h1>
      <p className="text-[11px] text-gray-400 mt-1">
        Lecture seule — aucun statut ni montant n&apos;est modifiable ici (règle 11.4/12.5).
      </p>

      <div className="flex gap-1.5 mt-3 flex-wrap">
        <a href="/admin/transactions" className={`text-[11px] px-2.5 py-1 rounded-full border ${!searchParams.statut ? "bg-pabo-gold border-pabo-gold text-admin-text" : "border-gray-300 text-gray-500"}`}>Tous</a>
        {STATUTS.map((s: any) => (
          <a key={s} href={`/admin/transactions?statut=${s}`} className={`text-[11px] px-2.5 py-1 rounded-full border ${searchParams.statut === s ? "bg-pabo-gold border-pabo-gold text-admin-text" : "border-gray-300 text-gray-500"}`}>
            {s}
          </a>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl mt-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-3 py-2">Date</th>
              <th className="text-left px-3 py-2">Candidat</th>
              <th className="text-left px-3 py-2">Téléphone</th>
              <th className="text-left px-3 py-2">Opérateur</th>
              <th className="text-left px-3 py-2">Votes</th>
              <th className="text-left px-3 py-2">Montant</th>
              <th className="text-left px-3 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {(transactions ?? []).map((t: any) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{new Date(t.created_at).toLocaleString("fr-FR")}</td>
                <td className="px-3 py-2 text-admin-text">{(t.candidats as { nom?: string } | null)?.nom ?? "—"}</td>
                <td className="px-3 py-2 text-gray-500">{t.telephone}</td>
                <td className="px-3 py-2 text-gray-500">{t.operateur}</td>
                <td className="px-3 py-2 text-gray-500">{t.nombre_votes}</td>
                <td className="px-3 py-2 text-gray-500">{t.montant.toLocaleString("fr-FR")} fcfa</td>
                <td className="px-3 py-2 text-gray-500">{t.statut}</td>
              </tr>
            ))}
            {(transactions ?? []).length === 0 && (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-gray-400">Aucune transaction.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
