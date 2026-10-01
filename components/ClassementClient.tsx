"use client";

import { useState } from "react";
import FilterChip from "@/components/FilterChip";
import PodiumTop3 from "@/components/PodiumTop3";
import { Categorie, Candidat } from "@/lib/types";

type Props = {
  categories: Categorie[];
  candidatsParCategorie: Record<string, Candidat[]>;
};

export default function ClassementClient({ categories, candidatsParCategorie }: Props) {
  const [categorieId, setCategorieId] = useState<string>(categories[0]?.id ?? "");

  const liste = (candidatsParCategorie[categorieId] ?? []).slice().sort((a, b) => b.votes_total - a.votes_total);

  return (
    <div>
      <div className="flex gap-2 px-4 pt-3 pb-1 overflow-x-auto">
        {categories.map((c) => (
          <FilterChip key={c.id} label={c.nom} active={c.id === categorieId} onClick={() => setCategorieId(c.id)} />
        ))}
      </div>

      {liste.length === 0 ? (
        <p className="text-center text-sm text-pabo-muted py-10">Aucun candidat dans cette catégorie.</p>
      ) : (
        <>
          <div className="pt-4">
            <PodiumTop3 top3={liste.slice(0, 3)} />
          </div>
          <div className="px-4 pt-5 pb-4 flex flex-col gap-1.5">
            {liste.slice(3).map((c, i) => (
              <div key={c.id} className="flex items-center justify-between py-1.5 border-b border-pabo-border">
                <span className="text-sm text-pabo-muted">{i + 4}. {c.nom}</span>
                <span className="text-sm text-pabo-muted">{c.votes_total.toLocaleString("fr-FR")}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
