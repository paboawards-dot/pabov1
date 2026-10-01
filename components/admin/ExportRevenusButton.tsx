"use client";

import { Download } from "lucide-react";

type Ligne = { categorie: string; revenuTotal: number; partVainqueur: number; partOrganisation: number };

export default function ExportRevenusButton({ lignes }: { lignes: Ligne[] }) {
  const exporter = () => {
    const entetes = "Categorie,Revenu total,Part vainqueur,Part organisation";
    const corps = lignes
      .map((l) => `${l.categorie},${l.revenuTotal},${l.partVainqueur},${l.partOrganisation}`)
      .join("\n");
    const blob = new Blob([`${entetes}\n${corps}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pabo-awards-revenus.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={exporter} className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-300 text-xs text-gray-600">
      <Download size={14} /> Exporter (CSV)
    </button>
  );
}
