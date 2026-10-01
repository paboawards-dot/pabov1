"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: "bordeaux" | "gold";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
};

// Bouton principal — une seule action forte par écran (cf. règles transversales Bloc PAGES).
// Couleur pleine, icône obligatoire, radius modéré, retour visuel au clic (scale).
export default function BoutonPrimaire({
  children,
  icon,
  onClick,
  variant = "bordeaux",
  disabled = false,
  loading = false,
  type = "button",
}: Props) {
  const bg = variant === "bordeaux" ? "bg-pabo-bordeaux" : "bg-pabo-gold";
  const textColor = variant === "bordeaux" ? "text-pabo-cream" : "text-pabo-bg";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full h-12 rounded-pabo ${bg} ${textColor} font-medium flex items-center justify-center gap-2
        transition-transform active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {!loading && <span>{children}</span>}
    </button>
  );
}
