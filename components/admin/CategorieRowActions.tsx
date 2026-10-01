"use client";

import { useState } from "react";
import { useAction } from "@/lib/useAction";
import { fermerCategorie, prolongerCategorie, reouvrirCategorie } from "@/app/admin/actions";

type Categorie = {
  id: string;
  nom: string;
  statut_override: "FERMEE_MANUELLEMENT" | "PROLONGATION" | null;
  motif_fermeture: string | null;
};

export default function CategorieRowActions({ categorie }: { categorie: Categorie }) {
  const [pending, startTransition] = useAction();
  const [motif, setMotif] = useState("");
  const [showMotif, setShowMotif] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const badge =
    categorie.statut_override === "FERMEE_MANUELLEMENT" ? (
      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px]">Fermée (fraude)</span>
    ) : categorie.statut_override === "PROLONGATION" ? (
      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px]">Prolongation</span>
    ) : (
      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px]">Normale</span>
    );

  const confirmerFermeture = () => {
    if (!motif.trim()) {
      setErreur("Le motif est obligatoire.");
      return;
    }
    setErreur(null);
    startTransition(async () => {
      try {
        await fermerCategorie(categorie.id, motif);
        setShowMotif(false);
        setMotif("");
      } catch (e) {
        setErreur(e instanceof Error ? e.message : "Erreur inconnue");
      }
    });
  };

  const handleProlonger = () => {
    const finIso = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
    startTransition(() => prolongerCategorie(categorie.id, finIso));
  };

  const handleReouvrir = () => {
    startTransition(() => reouvrirCategorie(categorie.id));
  };

  return (
    <div className="border border-gray-100 rounded-lg p-2.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs text-admin-text">{categorie.nom}</span>
        {badge}
      </div>

      <div className="flex gap-2 mt-2 flex-wrap">
        {categorie.statut_override ? (
          <button onClick={handleReouvrir} disabled={pending} className="text-[11px] px-2.5 py-1 rounded-md border border-gray-300 text-gray-600">
            Réouvrir
          </button>
        ) : (
          <>
            <button onClick={() => setShowMotif((v) => !v)} disabled={pending} className="text-[11px] px-2.5 py-1 rounded-md border border-red-300 text-red-600">
              Fermer (fraude)
            </button>
            <button onClick={handleProlonger} disabled={pending} className="text-[11px] px-2.5 py-1 rounded-md border border-amber-300 text-amber-600">
              Prolonger 48h (égalité)
            </button>
          </>
        )}
      </div>

      {showMotif && (
        <div className="mt-2 flex gap-2">
          <input
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Motif de la fermeture (obligatoire)"
            className="flex-1 h-9 px-2.5 rounded-lg border border-gray-300 text-xs"
          />
          <button onClick={confirmerFermeture} disabled={pending} className="text-[11px] px-3 rounded-lg bg-red-600 text-white">
            Confirmer
          </button>
        </div>
      )}
      {categorie.motif_fermeture && (
        <p className="text-[11px] text-gray-400 mt-1.5">Motif : {categorie.motif_fermeture}</p>
      )}
      {erreur && <p className="text-[11px] text-red-600 mt-1.5">{erreur}</p>}
    </div>
  );
}
