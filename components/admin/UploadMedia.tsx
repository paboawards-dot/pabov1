"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  label: string;
  folder: string; // ex. "candidats", "actualites", "partenaires"
  kind?: "image" | "video" | "both";
  value: string;
  onChange: (url: string) => void;
};

// Bouton d'ajout d'image/vidéo pour le back-office. Envoie le fichier choisi
// directement dans le bucket Supabase Storage "media", puis renseigne l'URL
// publique obtenue dans le champ correspondant (photo_url / video_url / logo_url).
export default function UploadMedia({ label, folder, kind = "image", value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const accept = kind === "image" ? "image/*" : kind === "video" ? "video/*" : "image/*,video/*";

  const handleFile = async (fichier: File) => {
    setErreur(null);
    setEnvoi(true);
    try {
      const supabase = createClient();
      const extension = fichier.name.split(".").pop() || "bin";
      const nomFichier = `${folder}/${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage.from("media").upload(nomFichier, fichier, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;

      const { data } = supabase.storage.from("media").getPublicUrl(nomFichier);
      onChange(data.publicUrl);
    } catch (err) {
      setErreur(
        err instanceof Error && err.message.includes("Bucket not found")
          ? "Le bucket \"media\" n'existe pas encore dans Supabase Storage."
          : err instanceof Error
          ? err.message
          : "Échec de l'envoi."
      );
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={envoi}
          className="h-10 px-3 rounded-lg border border-gray-300 text-sm flex items-center gap-1.5 text-admin-text disabled:opacity-50"
        >
          {envoi ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {envoi ? "Envoi..." : value ? "Remplacer" : "Ajouter un fichier"}
        </button>
        {value && !envoi && (
          <>
            {kind === "video" ? (
              <video src={value} className="h-10 w-10 rounded object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-10 w-10 rounded object-cover" />
            )}
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Retirer le fichier"
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const fichier = e.target.files?.[0];
          if (fichier) handleFile(fichier);
          e.target.value = "";
        }}
      />
      {erreur && <p className="text-xs text-red-600">{erreur}</p>}
    </div>
  );
}
