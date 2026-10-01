import { Star, Users, Globe } from "lucide-react";

const piliers = [
  { icon: Star, titre: "Valoriser", texte: "Les talents et les acteurs qui font vivre la région." },
  { icon: Users, titre: "Fédérer", texte: "Le public autour d'une compétition transparente et populaire." },
  { icon: Globe, titre: "Rayonner", texte: "Faire connaître le Bounkani au-delà de ses frontières." },
];

// 3 cartes fixes utilisées sur À propos (cf. Bloc Composants > PiliersCard).
export default function PiliersCard() {
  return (
    <div className="flex flex-col gap-2.5">
      {piliers.map(({ icon: Icon, titre, texte }) => (
        <div key={titre} className="bg-pabo-card border border-pabo-border rounded-pabo p-4">
          <div className="flex items-center gap-2">
            <Icon size={18} className="text-pabo-gold" />
            <p className="text-sm text-pabo-cream">{titre}</p>
          </div>
          <p className="text-xs text-pabo-muted mt-1.5">{texte}</p>
        </div>
      ))}
    </div>
  );
}
