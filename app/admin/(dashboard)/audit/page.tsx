import { createServerSupabase } from "@/lib/supabase/server";

export default async function AdminAuditPage() {
  const supabase = createServerSupabase();
  const { data: entries } = await supabase
    .from("audit_log")
    .select("*")
    .order("date", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-lg font-medium text-admin-text">Journal d&apos;audit</h1>
      <p className="text-[11px] text-gray-400 mt-1">
        Lecture seule — aucune ligne ne peut être modifiée ou supprimée, même par un administrateur (règle 11.13).
      </p>

      <div className="bg-white border border-gray-200 rounded-xl mt-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-3 py-2">Date</th>
              <th className="text-left px-3 py-2">Action</th>
              <th className="text-left px-3 py-2">Cible</th>
              <th className="text-left px-3 py-2">Résultat</th>
            </tr>
          </thead>
          <tbody>
            {(entries ?? []).map((e: any) => (
              <tr key={e.id} className="border-t border-gray-100">
                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{new Date(e.date).toLocaleString("fr-FR")}</td>
                <td className="px-3 py-2 text-admin-text">{e.type_action}</td>
                <td className="px-3 py-2 text-gray-500">{e.cible_type ?? "—"}</td>
                <td className="px-3 py-2 text-gray-500">{e.resultat}</td>
              </tr>
            ))}
            {(entries ?? []).length === 0 && (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-400">Aucune entrée pour l&apos;instant.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
