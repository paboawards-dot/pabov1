"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Trophy, FolderTree, Users, Receipt,
  Wallet, ScrollText, Newspaper, Handshake, Settings, LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const items = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/concours", label: "Concours", icon: Trophy },
  { href: "/admin/categories", label: "Univers & catégories", icon: FolderTree },
  { href: "/admin/candidats", label: "Candidats", icon: Users },
  { href: "/admin/transactions", label: "Transactions", icon: Receipt },
  { href: "/admin/revenus", label: "Paiements & revenus", icon: Wallet },
  { href: "/admin/audit", label: "Journal d'audit", icon: ScrollText },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { href: "/admin/partenaires", label: "Partenaires", icon: Handshake },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-full md:w-56 md:min-h-screen bg-white border-b md:border-b-0 md:border-r border-gray-200">
      <div className="p-4">
        <p className="text-sm font-medium text-admin-text">Pabo awards</p>
        <p className="text-[11px] text-gray-500">Administration</p>
      </div>
      <nav className="flex md:flex-col overflow-x-auto md:overflow-visible px-2 pb-2 md:pb-4 gap-0.5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap shrink-0 md:shrink
                ${active ? "bg-pabo-gold/15 text-admin-text font-medium" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 mt-0 md:mt-2"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </nav>
    </aside>
  );
}
