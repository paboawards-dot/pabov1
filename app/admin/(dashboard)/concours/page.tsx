import { createServerSupabase } from "@/lib/supabase/server";
import ConcoursDatesForm from "@/components/admin/ConcoursDatesForm";
import ConcoursStatutControl from "@/components/admin/ConcoursStatutControl";

export default async function AdminConcoursPage() {
  const supabase = createServerSupabase();
  const { data: concours } = await supabase
    .from("concours")
    .select("*")
    .order("annee", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: historique } = await supabase
    .from("audit_log")
    .select("*")
    .eq("cible_type", "concours")
    .order("date", { ascending: false })
    .limit(20);

  if (!concours) {
    return <p className="text-sm text-gray-500">Aucun concours configuré pour l&apos;instant.</p>;
  }

  return (
    <div>
      <h1 className="text-lg font-medium text-admin-text">Gestion du concours</h1>

      <ConcoursStatutControl concours={concours} />
      <ConcoursDatesForm concours={concours} />

      <div className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
        <p className="text-xs font-medium text-admin-text mb-2">Historique des changements</p>
        {(historique ?? []).length === 0 && <p className="text-xs text-gray-400">Aucun changement enregistré.</p>}
        <div className="flex flex-col gap-2">
          {(historique ?? []).map((h: any) => (
            <div key={h.id} className="text-xs text-gray-600 border-b border-gray-100 pb-2 last:border-0">
              <span className="text-gray-400">{new Date(h.date).toLocaleString("fr-FR")}</span> — {h.type_action} ({h.resultat})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
