"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, User, Check } from "lucide-react";
import QuantiteSelector from "./QuantiteSelector";
import BoutonPrimaire from "./BoutonPrimaire";
import { Candidat } from "@/lib/types";

const PRIX_VOTE_FCFA = 100;

type Props = {
  candidat: Candidat;
  onClose: () => void;
};

// Superposition de vote rapide ouverte depuis une carte candidat (grille
// Catégorie/Artistes) — cf. Bloc Composants > QuantiteModal. N'est jamais
// une route à part : fermer la modal ramène simplement à la grille.
export default function QuantiteModal({ candidat, onClose }: Props) {
  const [quantite, setQuantite] = useState(1);
  const router = useRouter();
  const total = quantite * PRIX_VOTE_FCFA;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full sm:w-96 sm:rounded-pabo rounded-t-2xl bg-pabo-bg border border-pabo-border p-4 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button onClick={onClose} aria-label="Fermer" className="text-pabo-muted">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 -mt-2">
          <div className="h-14 w-14 rounded-pabo bg-[#0a0a0a] border border-pabo-border flex items-center justify-center overflow-hidden shrink-0">
            {candidat.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={candidat.photo_url} alt={candidat.nom} className="w-full h-full object-cover" />
            ) : (
              <User size={22} className="text-[#4a4a4a]" />
            )}
          </div>
          <div>
            <p className="text-sm text-pabo-cream">{candidat.nom}</p>
            <p className="text-xs text-pabo-gold">{candidat.votes_total.toLocaleString("fr-FR")} votes</p>
          </div>
        </div>

        <div className="mt-4 p-3.5 bg-pabo-card border border-pabo-border rounded-pabo">
          <div className="flex items-center justify-between">
            <span className="text-xs text-pabo-muted">Nombre de votes</span>
            <QuantiteSelector value={quantite} onChange={setQuantite} />
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-pabo-border">
            <span className="text-xs text-pabo-muted">Total à payer</span>
            <span className="text-lg font-medium text-pabo-gold">{total.toLocaleString("fr-FR")} fcfa</span>
          </div>
        </div>

        <div className="mt-3.5">
          <BoutonPrimaire
            icon={<Check size={18} />}
            onClick={() => router.push(`/paiement/${candidat.slug}?quantite=${quantite}`)}
          >
            Payer et voter
          </BoutonPrimaire>
        </div>
      </div>
    </div>
  );
}
