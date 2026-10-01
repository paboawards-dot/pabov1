"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

// Barre de recherche utilisée sur Artistes (cf. Bloc Composants > SearchBar).
export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 px-3 h-11 bg-pabo-card border border-pabo-border rounded-pabo">
      <Search size={16} className="text-pabo-muted shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un candidat"
        className="bg-transparent outline-none text-sm text-pabo-cream placeholder:text-pabo-muted w-full"
      />
    </div>
  );
}
