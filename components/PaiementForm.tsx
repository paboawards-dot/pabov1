"use client";

import { useState } from "react";
import BoutonPrimaire from "./BoutonPrimaire";
import { Check } from "lucide-react";

const OPERATEURS: { value: string; label: string }[] = [
  { value: "ORANGE", label: "Orange money" },
  { value: "MTN", label: "MTN money" },
  { value: "MOOV", label: "Moov money" },
  { value: "WAVE", label: "Wave" },
];

type Props = { candidatSlug: string; nombreVotes: number };

// IMPORTANT (sécurité) : ce composant n'envoie au backend QUE candidatSlug,
// nombreVotes, telephone et operateur — jamais de montant. Le serveur
// (/api/votes/creer) recalcule et vérifie tout le reste (règle 12.13).
export default function PaiementForm({ candidatSlug, nombreVotes }: Props) {
  const [operateur, setOperateur] = useState<string | null>(null);
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const handleConfirmer = async () => {
    if (!operateur || telephone.trim().length < 8) {
      setErreur("Choisissez un opérateur et saisissez un numéro valide.");
      return;
    }
    setErreur(null);
    setLoading(true);

    try {
      const res = await fetch("/api/votes/creer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidatSlug, nombreVotes, telephone, operateur }),
      });
      const result = await res.json();

      if (!res.ok || !result.paymentUrl) {
        setErreur(result.error ?? "Une erreur est survenue. Réessayez.");
        setLoading(false);
        return;
      }

      // Redirection vers la page de paiement hébergée par CinetPay
      // (l'utilisateur y confirme via son opérateur — code PIN, etc.).
      window.location.href = result.paymentUrl;
    } catch {
      setErreur("Impossible de contacter le serveur. Vérifiez votre connexion.");
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-[11px] text-pabo-muted mt-4 mb-2">Choisir un opérateur</p>
      <div className="flex flex-col gap-2">
        {OPERATEURS.map((op) => (
          <button
            key={op.value}
            type="button"
            onClick={() => setOperateur(op.value)}
            className={`h-12 rounded-pabo border text-sm transition-colors ${
              operateur === op.value
                ? "border-pabo-gold text-pabo-cream"
                : "border-pabo-border text-pabo-cream"
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      {operateur && (
        <div className="mt-3">
          <label className="text-[11px] text-pabo-muted">Numéro de téléphone</label>
          <input
            type="tel"
            inputMode="numeric"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="07 00 00 00 00"
            className="w-full h-12 mt-1 px-3 rounded-pabo bg-pabo-card border border-pabo-border text-pabo-cream text-sm outline-none"
          />
        </div>
      )}

      {erreur && <p className="text-xs text-red-400 mt-3">{erreur}</p>}

      <div className="mt-4">
        <BoutonPrimaire
          icon={<Check size={18} />}
          onClick={handleConfirmer}
          disabled={!operateur || telephone.trim().length < 8}
          loading={loading}
        >
          Confirmer
        </BoutonPrimaire>
      </div>
    </div>
  );
}
