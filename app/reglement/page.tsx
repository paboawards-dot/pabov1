import HeaderApp from "@/components/HeaderApp";

const sections = [
  { id: "presentation", titre: "1. Présentation", texte: "Les Pabo awards sont un événement annuel de récompenses qui célèbre les talents artistiques, culturels, numériques et entrepreneuriaux de la région du Bounkani, ainsi que les personnalités et structures qui contribuent à son rayonnement. L'événement est présenté par Esprit Guerrier." },
  { id: "categories", titre: "2. Catégories", texte: "La compétition comprend 19 catégories réparties en 5 univers : Musique & Arts, Culture & Événementiel, Digital & Médias, Nightlife & Entrepreneuriat, et Rayonnement International." },
  { id: "vote", titre: "3. Modalités de vote", texte: "Le vainqueur de chaque catégorie est désigné exclusivement par vote public en ligne. Chaque vote coûte 100 FCFA et s'effectue via Mobile Money (Orange Money, MTN Money, Moov Money). Le nombre de votes par personne n'est pas limité. Le vote est ouvert pendant une durée d'un mois." },
  { id: "classement", titre: "4. Classement", texte: "Le classement de chaque catégorie est visible en temps réel, pendant toute la période de vote." },
  { id: "egalite", titre: "5. Égalité", texte: "En cas d'égalité parfaite entre plusieurs candidats à la clôture du vote d'une catégorie, une prolongation exceptionnelle de 24 à 48 heures peut être décidée pour départager les candidats concernés." },
  { id: "recompenses", titre: "6. Récompenses", texte: "Chaque vainqueur de catégorie reçoit un trophée officiel remis sur scène lors de la cérémonie. 50% des revenus de vote de sa catégorie lui sont reversés le jour même, sur scène." },
  { id: "fraude", titre: "7. Sécurité et fraude", texte: "Le système de vote est sécurisé et contrôlé. Toute fraude constatée entraîne le retrait immédiat de la catégorie concernée." },
  { id: "calendrier", titre: "8. Calendrier", texte: "Les dates d'ouverture des candidatures, d'ouverture du vote et de la cérémonie sont communiquées sur le site et les canaux officiels de l'événement." },
];

export default function ReglementPage() {
  return (
    <main>
      <HeaderApp backHref="/menu" breadcrumb="Règlement" />

      <div className="px-4 pt-3 pb-3 flex flex-wrap gap-x-3 gap-y-1.5">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="text-xs text-pabo-gold underline underline-offset-2">
            {s.titre}
          </a>
        ))}
      </div>

      <div className="px-4 pb-6 flex flex-col gap-4" style={{ scrollBehavior: "smooth" }}>
        {sections.map((s) => (
          <div key={s.id} id={s.id} className="scroll-mt-16">
            <p className="text-sm text-pabo-cream font-medium">{s.titre}</p>
            <p className="text-xs text-pabo-muted mt-1 leading-relaxed">{s.texte}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
