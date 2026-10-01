"use client";

import { useState } from "react";
import { useAction } from "@/lib/useAction";
import { changerStatutConcours } from "@/app/admin/actions";

const STATUTS = ["BROUILLON", "CANDIDATURES_OUVERTES", "VOTE_OUVERT", "VOTE_FERME", "TERMINE"] as const;

const LABELS: Record<(typeof STATUTS)[number], string> = {
  BROUILLON: "Brouillon",
  CANDIDATURES_OUVERTES: "Candidatures ouvertes",
  VOTE_OUVERT: "Vote ouvert",
  VOTE_FERME: "Vote fermé",
  TERMINE: "Terminé",
};

const COULEURS: Record<(typeof STATUTS)[number], string> = {
  BROUILLON: "bg-gray-100 text-gray-600",
  CANDIDATURES_OUVERTES: "bg-blue-100 text-blue-700",
  VOTE_OUVERT: "bg-green-100 text-green-700",
  VOTE_FERME: "bg-orange-100 text-orange-700",
  TERMINE: "bg-gray-200 text-gray-600",
};

type Concours = { id: string; statut: (typeof STATUTS)[number]; nom: string };

// C'est ICI la manœuvre d'ouverture/fermeture manuelle demandée — accessible
// directement depuis le tableau de bord (cf. Bloc Pages 1.15, Bloc Logique 5.1.2).
export default function ConcoursStatutControl({ concours }: { concours: Concours }) {
  const [statut, setStatut] = useState(concours.statut);
  const [pending, startTransition] = useAction();
  const [erreur, setErreur] = useState<string | null>(null);

  const handleChange = (nouveau: (typeof STATUTS)[number]) => {
    if (nouveau === statut) return;
    const precedent = statut;
    setErreur(null);
    startTransition(async () => {
      try {
        await changerStatutConcours(concours.id, nouveau, precedent);
        setStatut(nouveau);
      } catch (e) {
        setErreur(e instanceof Error ? e.message : "Erreur inconnue");
      }
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs text-gray-500">{concours.nom}</p>
          <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${COULEURS[statut]}`}>
            {LABELS[statut]}
          </span>
        </div>
        <select
          value={statut}
          disabled={pending}
          onChange={(e) => handleChange(e.target.value as (typeof STATUTS)[number])}
          className="h-9 px-2.5 rounded-lg border border-gray-300 text-xs disabled:opacity-50"
        >
          {STATUTS.map((s) => (
            <option key={s} value={s}>{LABELS[s]}</option>
          ))}
        </select>
      </div>
      {erreur && <p className="text-xs text-red-600 mt-2">{erreur}</p>}
    </div>
  );
}
