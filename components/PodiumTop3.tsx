import { Candidat } from "@/lib/types";

// Podium top 3 utilisé sur Classement général (cf. Bloc Composants > PodiumTop3).
export default function PodiumTop3({ top3 }: { top3: Candidat[] }) {
  const [premier, deuxieme, troisieme] = top3;
  const medaille = ["#D4A63A", "#C9C9C9", "#B08D57"];

  const bloc = (c: Candidat | undefined, rang: number, hauteur: string) =>
    c && (
      <div className="flex flex-col items-center" style={{ flex: 1 }}>
        <span
          className="h-6 w-6 rounded-full text-[11px] font-medium flex items-center justify-center mb-1.5"
          style={{ backgroundColor: medaille[rang - 1], color: "#000000" }}
        >
          {rang}
        </span>
        <div
          className="w-full bg-pabo-card border border-pabo-border rounded-pabo flex flex-col items-center justify-end p-2"
          style={{ height: hauteur }}
        >
          <p className="text-xs text-pabo-cream text-center truncate w-full">{c.nom}</p>
          <p className="text-[11px] text-pabo-gold">{c.votes_total.toLocaleString("fr-FR")}</p>
        </div>
      </div>
    );

  return (
    <div className="flex items-end gap-2 px-4">
      {bloc(deuxieme, 2, "76px")}
      {bloc(premier, 1, "96px")}
      {bloc(troisieme, 3, "64px")}
    </div>
  );
}
