"use client";

import { useState } from "react";
import { useAction } from "@/lib/useAction";
import { creerPartenaire } from "@/app/admin/actions";
import UploadMedia from "./UploadMedia";

export default function PartenaireCreateForm() {
  const [nom, setNom] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [pending, startTransition] = useAction();
  const [erreur, setErreur] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !role.trim()) return;
    setErreur(null);
    startTransition(async () => {
      try {
        await creerPartenaire({ nom, role, description, logo_url: logoUrl || undefined });
        setNom("");
        setRole("");
        setDescription("");
        setLogoUrl("");
      } catch (err) {
        setErreur(err instanceof Error ? err.message : "Erreur inconnue");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 mt-3 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Nom</label>
          <input value={nom} onChange={(e) => setNom(e.target.value)} className="h-10 px-2.5 rounded-lg border border-gray-300 text-sm w-44" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Rôle</label>
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ex. Partenaire technique" className="h-10 px-2.5 rounded-lg border border-gray-300 text-sm w-48" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="h-10 px-2.5 rounded-lg border border-gray-300 text-sm w-60" />
        </div>
      </div>
      <UploadMedia label="Logo" folder="partenaires" kind="image" value={logoUrl} onChange={setLogoUrl} />
      <button type="submit" disabled={pending} className="self-start h-10 px-4 rounded-lg bg-pabo-gold text-admin-text text-sm font-medium disabled:opacity-50">
        {pending ? "Ajout..." : "Ajouter"}
      </button>
      {erreur && <p className="text-xs text-red-600">{erreur}</p>}
    </form>
  );
}
