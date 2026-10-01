"use client";

import { useState } from "react";
import { useAction } from "@/lib/useAction";
import { mettreAJourDatesConcours } from "@/app/admin/actions";

type Concours = {
  id: string;
  date_ouverture_candidatures: string | null;
  date_ouverture_vote: string | null;
  date_fermeture_vote: string | null;
};

export default function ConcoursDatesForm({ concours }: { concours: Concours }) {
  const [dates, setDates] = useState({
    date_ouverture_candidatures: concours.date_ouverture_candidatures ?? "",
    date_ouverture_vote: concours.date_ouverture_vote ?? "",
    date_fermeture_vote: concours.date_fermeture_vote ?? "",
  });
  const [pending, startTransition] = useAction();
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      try {
        await mettreAJourDatesConcours(concours.id, dates);
        setMessage("Dates enregistrées.");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Erreur inconnue");
      }
    });
  };

  const champ = (label: string, key: keyof typeof dates) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type="date"
        value={dates[key]}
        onChange={(e) => setDates((d) => ({ ...d, [key]: e.target.value }))}
        className="h-10 px-2.5 rounded-lg border border-gray-300 text-sm"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
      <p className="text-xs font-medium text-admin-text mb-3">Dates clés</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {champ("Ouverture des candidatures", "date_ouverture_candidatures")}
        {champ("Ouverture du vote", "date_ouverture_vote")}
        {champ("Fermeture du vote", "date_fermeture_vote")}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-3 h-10 px-4 rounded-lg bg-pabo-gold text-admin-text text-sm font-medium disabled:opacity-50"
      >
        {pending ? "Enregistrement..." : "Enregistrer"}
      </button>
      {message && <p className="text-xs text-gray-500 mt-2">{message}</p>}
    </form>
  );
}
