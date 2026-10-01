import Link from "next/link";
import HeaderApp from "@/components/HeaderApp";
import CarrouselActualites from "@/components/CarrouselActualites";
import UniversCard from "@/components/UniversCard";
import { createServerSupabase } from "@/lib/supabase/server";
import { Smartphone, Apple } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccueilPage() {
  const supabase = createServerSupabase();

  const [{ data: univers }, { data: actualites }] = await Promise.all([
    supabase.from("univers").select("*").order("ordre_affichage"),
    supabase.from("actualites").select("*").order("ordre_carrousel").limit(5),
  ]);

  return (
    <main>
      <HeaderApp />

      <div className="px-4 pt-4 pb-1.5 flex items-center justify-between">
        <Link href="/actualites" className="text-[11px] text-pabo-muted">Actualités</Link>
        <Link href="/actualites" className="text-[11px] text-pabo-gold">Voir tout</Link>
      </div>
      <CarrouselActualites items={actualites ?? []} />

      <Link href="/univers" className="block px-4 pt-5 pb-2 text-[11px] text-pabo-muted">Univers</Link>
      <div className="grid grid-cols-2 gap-2.5 px-4">
        {(univers ?? []).map((u: any) => (
          <UniversCard key={u.id} univers={u} />
        ))}
      </div>

      {/* Bandeau "Télécharger l'application" — cf. Bloc Pages 1.9 bis */}
      <div className="mx-4 mt-6 mb-4 p-3.5 rounded-pabo bg-pabo-card border border-pabo-border flex items-center gap-3">
        <Smartphone size={22} className="text-pabo-gold shrink-0" />
        <div className="flex-1">
          <p className="text-xs text-pabo-cream">Installer Pabo awards</p>
          <p className="text-[10px] text-pabo-muted mt-0.5">Bientôt disponible sur App Store / Google Play</p>
        </div>
        <Apple size={16} className="text-pabo-muted opacity-40" />
      </div>
    </main>
  );
}
