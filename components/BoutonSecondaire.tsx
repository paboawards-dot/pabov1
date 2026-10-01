"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
};

// Bouton d'action secondaire — contour, jamais rempli (cf. règles transversales Bloc PAGES).
export default function BoutonSecondaire({ children, icon, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-12 rounded-pabo border border-pabo-border text-pabo-cream font-medium
        flex items-center justify-center gap-2 transition-transform active:scale-[0.97]"
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
