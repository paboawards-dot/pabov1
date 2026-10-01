"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import QuantiteSelector from "./QuantiteSelector";
import BoutonPrimaire from "./BoutonPrimaire";
import { PRIX_VOTE_FCFA } from "@/lib/data";

type Props = {
  candidatSlug: string;
};

// Bloc récapitulatif + CTA de la fiche Candidat (cf. Bloc Composants > RecapPaiement).
// IMPORTANT (sécurité) : ce composant n'envoie au backend que candidatSlug + quantite.
// Le montant est TOUJOURS recalculé côté serveur — jamais transmis tel quel par le
// frontend (cf. cahier des charges, règle 12.13 et Bloc Logique 5.2 bis).
export default function CandidatVoteBlock({ candidatSlug }: Props) {
  const [quantite, setQuantite] = useState(1);
  const router = useRouter();
  const total = quantite * PRIX_VOTE_FCFA;

  const handlePayer = () => {
    // TODO(backend) : créer la transaction côté serveur (voir /app/api/webhook/cinetpay)
    // avant de rediriger — ici on route seulement vers l'écran Paiement pour la démo.
    router.push(`/paiement/${candidatSlug}?quantite=${quantite}`);
  };

  return (
    <div className="mx-4 mt-3.5 p-3.5 bg-pabo-card border border-pabo-border rounded-pabo">
      <div className="flex items-center justify-between">
        <span className="text-xs text-pabo-muted">Prix du vote</span>
        <span className="text-sm text-pabo-cream">{PRIX_VOTE_FCFA} fcfa</span>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-pabo-muted">Nombre de votes</span>
        <QuantiteSelector value={quantite} onChange={setQuantite} />
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-pabo-border">
        <span className="text-xs text-pabo-muted">Total à payer</span>
        <span className="text-lg font-medium text-pabo-gold">{total.toLocaleString("fr-FR")} fcfa</span>
      </div>

      <div className="mt-3.5">
        <BoutonPrimaire icon={<Check size={18} />} onClick={handlePayer}>
          Payer et voter
        </BoutonPrimaire>
      </div>
    </div>
  );
}
