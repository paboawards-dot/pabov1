"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";

// Enveloppe du site public (colonne mobile + barre de navigation basse).
// Le back-office (/admin) a sa propre mise en page pleine largeur : on n'y
// applique ni la colonne étroite ni la barre du bas.
export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <div className="max-w-md mx-auto pb-20">{children}</div>
      <BottomNav />
    </>
  );
}
