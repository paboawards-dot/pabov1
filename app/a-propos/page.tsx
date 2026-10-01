import HeaderApp from "@/components/HeaderApp";
import PiliersCard from "@/components/PiliersCard";

export default function AProposPage() {
  return (
    <main>
      <HeaderApp backHref="/menu" breadcrumb="À propos" />

      <div className="px-4 pt-3 pb-4">
        <h1 className="text-lg text-pabo-cream">Pabo awards — Prix de l&apos;art du Bounkani</h1>
        <p className="text-sm text-pabo-muted mt-2.5 leading-relaxed">
          Les Pabo awards sont un événement annuel de récompenses qui célèbre les talents
          artistiques, culturels, numériques et entrepreneuriaux de la région du Bounkani, ainsi
          que les personnalités et structures qui contribuent à son rayonnement.
        </p>
        <p className="text-sm text-pabo-muted mt-2.5 leading-relaxed">
          L&apos;événement récompense 19 catégories, réparties en 5 univers. Le vainqueur de
          chaque catégorie est désigné exclusivement par vote public en ligne : chaque vote coûte
          100 FCFA, et le classement est visible en temps réel pendant toute la période de vote.
        </p>
        <p className="text-sm text-pabo-muted mt-2.5">
          Les Pabo awards sont présentés par Esprit Guerrier.
        </p>

        <p className="text-[11px] text-pabo-muted mt-5 mb-2">Notre mission</p>
        <PiliersCard />
      </div>
    </main>
  );
}
