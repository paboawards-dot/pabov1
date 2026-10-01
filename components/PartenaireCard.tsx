import { Partenaire } from "@/lib/data";

// Carte partenaire utilisée sur la page Partenaires (cf. Bloc Composants > PartenaireCard).
export default function PartenaireCard({ partenaire }: { partenaire: Partenaire }) {
  return (
    <div className="bg-pabo-card border border-pabo-border rounded-pabo p-4 flex items-center gap-3">
      {partenaire.logo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={partenaire.logo_url} alt={partenaire.nom} className="h-12 w-12 rounded-pabo object-cover shrink-0" />
      )}
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-pabo-gold">{partenaire.role}</p>
        <p className="text-base text-pabo-cream mt-1">{partenaire.nom}</p>
        <p className="text-xs text-pabo-muted mt-1.5">{partenaire.description}</p>
      </div>
    </div>
  );
}
