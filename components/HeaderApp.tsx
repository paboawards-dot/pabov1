import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import WaxBand from "./WaxBand";
import TrophyLogo from "./TrophyLogo";

type Props = {
  backHref?: string; // si fourni, affiche un chevron retour (pages internes)
  breadcrumb?: string; // ex. "Musique & arts"
};

// En-tête présent sur toutes les pages publiques (cf. Bloc Composants > HeaderApp).
export default function HeaderApp({ backHref, breadcrumb }: Props) {
  return (
    <header className="sticky top-0 z-10 bg-pabo-bg">
      <WaxBand />
      <div className="flex items-center justify-center gap-1.5 py-2.5 relative">
        {backHref && (
          <Link href={backHref} className="absolute left-4 text-pabo-cream">
            <ChevronLeft size={22} />
          </Link>
        )}
        <TrophyLogo size={20} />
        <span className="text-sm font-medium text-pabo-gold tracking-wide">Pabo awards</span>
      </div>
      {breadcrumb && (
        <p className="px-4 pb-2 text-xs text-pabo-muted">{breadcrumb}</p>
      )}
    </header>
  );
}
