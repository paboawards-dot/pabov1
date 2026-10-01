import Link from "next/link";
import { CalendarDays } from "lucide-react";
import HeaderApp from "@/components/HeaderApp";
import type { Actualite } from "@/lib/types";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function ActualitesPage() {
  const supabase = createServerSupabase();
  const { data: actualites } = await supabase
    .from("actualites")
    .select("*")
    .order("date_publication", { ascending: false });

  return (
    <main>
      <HeaderApp backHref="/menu" breadcrumb="Actualités" />
      <div className="px-4 pt-3 flex flex-col gap-2.5 pb-4">
        {(actualites ?? []).map((a: Actualite) => (
          <Link key={a.id} href={`/actualites/${a.id}`} className="flex gap-3 items-center bg-pabo-card border border-pabo-border rounded-pabo p-4">
            {a.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.image_url} alt="" className="h-14 w-14 rounded-pabo object-cover shrink-0" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-pabo-muted text-[11px]">
                <CalendarDays size={13} />
                <span>{new Date(a.date_publication).toLocaleDateString("fr-FR")}</span>
              </div>
              <p className="text-sm text-pabo-cream mt-1.5 truncate">{a.titre}</p>
            </div>
          </Link>
        ))}
        {(actualites ?? []).length === 0 && <p className="text-center text-sm text-pabo-muted py-8">Aucune actualité pour l&apos;instant.</p>}
      </div>
    </main>
  );
}
