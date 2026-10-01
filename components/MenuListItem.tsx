import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

type Props = {
  href: string;
  label: string;
  icon: LucideIcon;
};

// Ligne cliquable de l'écran Menu (cf. Bloc Composants > MenuListItem).
export default function MenuListItem({ href, label, icon: Icon }: Props) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-3.5 border-b border-pabo-border last:border-0"
    >
      <span className="flex items-center gap-3">
        <Icon size={20} className="text-pabo-gold" />
        <span className="text-sm text-pabo-cream">{label}</span>
      </span>
      <ChevronRight size={18} className="text-pabo-muted" />
    </Link>
  );
}
