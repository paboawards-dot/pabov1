"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Heart, Link2 } from "lucide-react";
import { Candidat } from "@/lib/types";
import QuantiteModal from "./QuantiteModal";

type Props = {
  candidat: Candidat;
};

// Carte candidat utilisée sur Catégorie et Artistes (cf. Bloc Composants > CandidatCard).
export default function CandidatCard({ candidat }: Props) {
  const [modalOuverte, setModalOuverte] = useState(false);

  return (
    <div className="bg-pabo-card border border-pabo-border rounded-pabo overflow-hidden">
      <Link href={`/candidat/${candidat.slug}`} className="block">
        <div className="aspect-square bg-[#0a0a0a] flex items-center justify-center">
          {candidat.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={candidat.photo_url} alt={candidat.nom} className="w-full h-full object-cover" />
          ) : (
            <User size={40} className="text-[#4a4a4a]" />
          )}
        </div>
        <div className="p-2.5">
          <p className="text-sm text-pabo-cream truncate">{candidat.nom}</p>
          <p className="text-xs text-pabo-gold mt-0.5">{candidat.votes_total.toLocaleString("fr-FR")} votes</p>
        </div>
      </Link>
      <div className="flex gap-2 px-2.5 pb-2.5">
        <button
          type="button"
          onClick={() => setModalOuverte(true)}
          className="flex-1 h-9 rounded-pabo bg-pabo-bordeaux text-pabo-cream text-xs font-medium flex items-center justify-center gap-1"
        >
          <Heart size={14} /> Voter
        </button>
        <button
          type="button"
          aria-label="Copier le lien"
          className="h-9 w-9 rounded-pabo border border-pabo-border text-pabo-muted flex items-center justify-center"
          onClick={() => {
            const url = `${window.location.origin}/candidat/${candidat.slug}`;
            navigator.clipboard?.writeText(url);
          }}
        >
          <Link2 size={14} />
        </button>
      </div>

      {modalOuverte && <QuantiteModal candidat={candidat} onClose={() => setModalOuverte(false)} />}
    </div>
  );
}
