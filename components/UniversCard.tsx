import Link from "next/link";
import { Music, Drama, Smartphone, Martini, Globe, type LucideIcon } from "lucide-react";
import { Univers } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  music: Music,
  mask: Drama,
  "device-mobile": Smartphone,
  "glass-cocktail": Martini,
  world: Globe,
};

type Props = { univers: Univers };

// Carte univers cliquable, utilisée sur l'Accueil (cf. Bloc Composants > UniversCard).
export default function UniversCard({ univers }: Props) {
  const Icon = ICONS[univers.icone] ?? Music;
  return (
    <Link
      href={`/univers/${univers.slug}`}
      className="bg-pabo-card border border-pabo-border rounded-pabo p-4 flex flex-col items-center gap-1.5 text-center"
    >
      <Icon size={22} className="text-pabo-gold" />
      <span className="text-xs text-pabo-cream">{univers.nom}</span>
    </Link>
  );
}
