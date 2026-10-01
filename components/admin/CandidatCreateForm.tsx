"use client";

import { useState } from "react";
import { useAction } from "@/lib/useAction";
import { creerCandidat } from "@/app/admin/actions";
import UploadMedia from "./UploadMedia";

function slugify(texte: string) {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CandidatCreateForm({ categories }: { categories: { id: string; nom: string }[] }) {
  const [nom, setNom] = useState("");
  const [categorieId, setCategorieId] = useState(categories[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pending, startTransition] = useAction();
  const [erreur, setErreur] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !categorieId) return;
    setErreur(null);
    startTransition(async () => {
      try {
        await creerCandidat({
          nom,
          slug: slugify(nom),
          categorie_id: categorieId,
          description: description || undefined,
          photo_url: photoUrl || undefined,
          video_url: videoUrl || undefined,
        });
        setNom("");
        setDescription("");
        setPhotoUrl("");
        setVideoUrl("");
      } catch (err) {
        setErreur(err instanceof Error ? err.message : "Erreur inconnue");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 mt-4 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Nom du candidat</label>
          <input value={nom} onChange={(e) => setNom(e.target.value)} className="h-10 px-2.5 rounded-lg border border-gray-300 text-sm w-56" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Catégorie</label>
          <select value={categorieId} onChange={(e) => setCategorieId(e.target.value)} className="h-10 px-2.5 rounded-lg border border-gray-300 text-sm">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="px-2.5 py-2 rounded-lg border border-gray-300 text-sm resize-none" />
      </div>

      <div className="flex flex-wrap gap-4">
        <UploadMedia label="Photo" folder="candidats" kind="image" value={photoUrl} onChange={setPhotoUrl} />
        <UploadMedia label="Vidéo (optionnel)" folder="candidats" kind="video" value={videoUrl} onChange={setVideoUrl} />
      </div>

      <button type="submit" disabled={pending} className="self-start h-10 px-4 rounded-lg bg-pabo-gold text-admin-text text-sm font-medium disabled:opacity-50">
        {pending ? "Ajout..." : "Ajouter"}
      </button>
      {erreur && <p className="text-xs text-red-600">{erreur}</p>}
    </form>
  );
}
