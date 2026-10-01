"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  kind?: "image" | "video";
};

// Champ d'ajout de média (photo ou vidéo) : envoie le fichier choisi dans le
// bucket Supabase Storage "medias", puis renseigne l'URL publique obtenue
// dans le champ correspondant du formulaire (photo_url / video_url / logo_url).
// Nécessite le bucket "medias" créé par supabase/migration_medias.sql.
export default function MediaUploadField({ label, value, onChange, kind = "image" }: Props) {
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = kind === "video" ? "video/*" : "image/*";
  const tailleMaxMo = kind === "video" ? 100 : 10;

  const handleFile = async (file: File) => {
    setErreur(null);
    if (file.size > tailleMaxMo * 1024 * 1024) {
      setErreur(`Fichier trop lourd (max ${tailleMaxMo} Mo).`);
      return;
    }
    setEnCours(true);
    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop() ?? "bin";
      const chemin = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

      const { error } = await supabase.storage.from("medias").upload(chemin, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;

      const { data } = supabase.storage.from("medias").getPublicUrl(chemin);
      onChange(data.publicUrl);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Échec de l'envoi.");
    } finally {
      setEnCours(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={enCours}
          onClick={() => inputRef.current?.click()}
          className="h-10 px-3 rounded-lg border border-gray-300 text-sm flex items-center gap-1.5 text-admin-text disabled:opacity-50"
        >
          {enCours ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
          {enCours ? "Envoi..." : value ? "Remplacer" : `Ajouter ${kind === "video" ? "une vidéo" : "une image"}`}
        </button>
        {value && !enCours && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400"
            aria-label="Retirer"
          >
            <X size={15} />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {value && kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Aperçu" className="h-16 w-16 object-cover rounded-lg border border-gray-200 mt-1" />
      )}
      {value && kind === "video" && (
        <video src={value} controls className="h-24 rounded-lg border border-gray-200 mt-1" />
      )}
      {erreur && <p className="text-[11px] text-red-600">{erreur}</p>}
    </div>
  );
}
