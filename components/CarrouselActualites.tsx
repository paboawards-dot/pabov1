"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Actualite } from "@/lib/types";

type Props = { items: Actualite[] };

// Carrousel automatique (défilement toutes les 3 s). Toucher une actualité ouvre
// son détail ; les points permettent de changer d'actualité manuellement.
export default function CarrouselActualites({ items }: Props) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (items.length < 2) return;
    timerRef.current = setInterval(() => {
      setIndex((i: number) => (i + 1) % items.length);
    }, 3000);
  };

  useEffect(() => {
    restart();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  if (items.length === 0) {
    return (
      <Link
        href="/actualites"
        className="mx-4 h-[120px] rounded-pabo bg-[#0a0a0a] border border-pabo-border flex flex-col items-center justify-center gap-1.5"
      >
        <CalendarDays size={26} className="text-pabo-muted" />
        <span className="text-xs text-pabo-muted">Aucune actualité pour l&apos;instant</span>
      </Link>
    );
  }

  const current = items[index % items.length];

  return (
    <div className="relative mx-4 h-[120px] rounded-pabo overflow-hidden bg-[#0a0a0a] border border-pabo-border">
      <Link
        href={`/actualites/${current.id}`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-5 text-center"
      >
        {current.image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <CalendarDays size={26} className="text-pabo-gold relative" />
        )}
        <span className="text-sm text-pabo-cream relative">{current.titre}</span>
      </Link>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-10">
        {items.map((_: Actualite, i: number) => (
          <button
            key={i}
            type="button"
            aria-label={`Actualité ${i + 1}`}
            onClick={() => {
              setIndex(i);
              restart();
            }}
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: i === index ? "#D4A63A" : "#3a3a3a" }}
          />
        ))}
      </div>
    </div>
  );
}
