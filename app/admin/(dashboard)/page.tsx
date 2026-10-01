import { Trophy, Wallet, Users, Receipt } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import ConcoursStatutControl from "@/components/admin/ConcoursStatutControl";

// Vue d'ensemble : statut du concours (avec action directe) + KPI (cf. Bloc Pages 1.15).
export default async function AdminDashboardPage() {
  const supabase = createServerSupabase();

  const [{ data: concours }, { count: candidatsCount }, { count: transactionsPending }] =
    await Promise.all([
      supabase.from("concours").select("*").order("annee", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("candidats").select("*", { count: "exact", head: true }).eq("actif", true),
      supabase.from("transactions").select("*", { count: "exact", head: true }).eq("statut", "PENDING"),
    ]);

  const { data: votesTotalRows } = await supabase.from("candidats").select("votes_total");
  const votesTotal = (votesTotalRows ?? []).reduce((sum: number, c: any) => sum + (c.votes_total ?? 0), 0);
  const revenusTotal = votesTotal * 100;

  const cards = [
    { label: "Votes cumulés", value: votesTotal.toLocaleString("fr-FR"), icon: Trophy },
    { label: "Revenus (FCFA)", value: revenusTotal.toLocaleString("fr-FR"), icon: Wallet },
    { label: "Candidats actifs", value: candidatsCount ?? 0, icon: Users },
    { label: "Transactions en attente", value: transactionsPending ?? 0, icon: Receipt },
  ];

  return (
    <div>
      <h1 className="text-lg font-medium text-admin-text">Tableau de bord</h1>

      {concours && <ConcoursStatutControl concours={concours} />}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
            <Icon size={18} className="text-pabo-gold" />
            <p className="text-xl font-medium text-admin-text mt-2">{value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
