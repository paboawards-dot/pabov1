import Link from "next/link";
import { Categorie } from "@/lib/types";

type Props = {
  categorie: Categorie;
  nombreCandidats: number;
};

// Tuile catégorie utilisée sur la page Univers (cf. Bloc Composants > CategorieTuile).
export default function CategorieTuile({ categorie, nombreCandidats }: Props) {
  return (
    <Link
      href={`/categorie/${categorie.slug}`}
      className="block bg-pabo-card border border-pabo-border rounded-pabo p-4"
    >
      <p className="text-sm text-pabo-cream">{categorie.nom}</p>
      <p className="text-xs text-pabo-muted mt-1">{nombreCandidats} candidat{nombreCandidats > 1 ? "s" : ""}</p>
    </Link>
  );
}
