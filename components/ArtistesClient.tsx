"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import CandidatCard from "@/components/CandidatCard";
import { Candidat } from "@/lib/types";

export default function ArtistesClient({ candidats }: { candidats: Candidat[] }) {
  const [q, setQ] = useState("");
  const resultats = candidats.filter((c) => c.nom.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <div className="px-4 pt-3">
        <SearchBar value={q} onChange={setQ} />
      </div>
      <div className="px-4 pt-3 grid grid-cols-2 gap-2.5 pb-4">
        {resultats.length === 0 && <p className="col-span-2 text-center text-sm text-pabo-muted py-8">Aucun résultat.</p>}
        {resultats.map((c) => <CandidatCard key={c.id} candidat={c} />)}
      </div>
    </>
  );
}
