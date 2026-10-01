"use client";

import { useState } from "react";
import { useAction } from "@/lib/useAction";
import { creerActualite } from "@/app/admin/actions";
import UploadMedia from "./UploadMedia";

export default function ActualiteCreateForm() {
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pending, startTransition] = useAction();
  const [erreur, setErreur] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim()) return;
    setErreur(null);
    startTransition(async () => {
      try {
        await creerActualite({
          titre,
          contenu,
          image_url: imageUrl || undefined,
          video_url: videoUrl || undefined,
        });
        setTitre("");
        setContenu("");
        setImageUrl("");
        setVideoUrl("");
      } catch (err) {
        setErreur(err instanceof Error ? err.message : "Erreur inconnue");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 mt-3 flex flex-col gap-2.5">
      <input
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        placeholder="Titre"
        className="h-10 px-2.5 rounded-lg border border-gray-300 text-sm"
      />
      <textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder="Contenu"
        rows={3}
        className="px-2.5 py-2 rounded-lg border border-gray-300 text-sm resize-none"
      />
      <div className="flex flex-wrap gap-4">
        <UploadMedia label="Image" folder="actualites" kind="image" value={imageUrl} onChange={setImageUrl} />
        <UploadMedia label="Vidéo (optionnel)" folder="actualites" kind="video" value={videoUrl} onChange={setVideoUrl} />
      </div>
      <button type="submit" disabled={pending} className="self-start h-10 px-4 rounded-lg bg-pabo-gold text-admin-text text-sm font-medium disabled:opacity-50">
        {pending ? "Ajout..." : "Publier"}
      </button>
      {erreur && <p className="text-xs text-red-600">{erreur}</p>}
    </form>
  );
}
