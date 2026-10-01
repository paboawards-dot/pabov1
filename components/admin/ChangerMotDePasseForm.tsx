"use client";

import { useState } from "react";
import { useAction } from "@/lib/useAction";
import { changerMotDePasse } from "@/app/admin/actions";

export default function ChangerMotDePasseForm() {
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pending, startTransition] = useAction();
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (motDePasse.length < 8) {
      setMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (motDePasse !== confirmation) {
      setMessage("Les deux mots de passe ne correspondent pas.");
      return;
    }
    startTransition(async () => {
      try {
        await changerMotDePasse(motDePasse);
        setMessage("Mot de passe mis à jour.");
        setMotDePasse("");
        setConfirmation("");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Erreur inconnue");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 mt-4 flex flex-col gap-2.5 max-w-xs">
      <p className="text-xs font-medium text-admin-text">Changer le mot de passe</p>
      <input
        type="password"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        placeholder="Nouveau mot de passe"
        className="h-10 px-2.5 rounded-lg border border-gray-300 text-sm"
      />
      <input
        type="password"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        placeholder="Confirmer le mot de passe"
        className="h-10 px-2.5 rounded-lg border border-gray-300 text-sm"
      />
      <button type="submit" disabled={pending} className="h-10 rounded-lg bg-pabo-gold text-admin-text text-sm font-medium disabled:opacity-50">
        {pending ? "Enregistrement..." : "Mettre à jour"}
      </button>
      {message && <p className="text-xs text-gray-500">{message}</p>}
    </form>
  );
}
