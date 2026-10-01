"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

// Sélecteur +/- utilisé sur la fiche Candidat (cf. Bloc Composants > QuantiteSelector).
export default function QuantiteSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        aria-label="Diminuer"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="h-8 w-8 rounded-lg border border-pabo-bordeaux text-pabo-cream flex items-center justify-center"
      >
        <Minus size={16} />
      </button>
      <span className="w-5 text-center text-pabo-cream">{value}</span>
      <button
        type="button"
        aria-label="Augmenter"
        onClick={() => onChange(value + 1)}
        className="h-8 w-8 rounded-lg border border-pabo-gold text-pabo-gold flex items-center justify-center"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
