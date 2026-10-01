"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Users, Trophy, Menu } from "lucide-react";

const items = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/univers", label: "Categories", icon: LayoutGrid },
  { href: "/artistes", label: "Artistes", icon: Users },
  { href: "/classement", label: "Classement", icon: Trophy },
  { href: "/menu", label: "Menu", icon: Menu },
];

// Barre de navigation basse — masquée sur /paiement et /confirmation
// (cf. Bloc Navigation, "Visibilité de BottomNav").
export default function BottomNav() {
  const pathname = usePathname();
  const hidden = pathname?.startsWith("/paiement") || pathname?.startsWith("/confirmation");

  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-pabo-bg border-t border-pabo-border">
      <div className="flex justify-around items-center py-2.5 max-w-md mx-auto">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          const color = active ? "text-pabo-gold" : "text-pabo-muted";
          return (
            <Link key={href} href={href} className={`flex flex-col items-center gap-0.5 ${color}`}>
              <Icon size={20} />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
