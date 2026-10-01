"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import HeaderApp from "@/components/HeaderApp";
import StatusIcon from "@/components/StatusIcon";
import BoutonPrimaire from "@/components/BoutonPrimaire";

type Statut = "PENDING" | "PAID" | "PROCESSED" | "FAILED" | "CANCELLED" | "EXPIRED" | "REFUNDED";

type StatutReponse = {
  statut: Statut;
  nombreVotes: number;
  montant: number;
  candidat: { nom: string; slug: string } | null;
};

// Le statut affiché ici vient TOUJOURS d'une vérification serveur (jamais du
// frontend) — voir /api/votes/statut, alimentée elle-même par le webhook
// CinetPay vérifié server-to-server (cf. Bloc Logique 5.2/5.3).
export default function ConfirmationPage({ params }: { params: { transactionId: string } }) {
  const [data, setData] = useState<StatutReponse | null>(null);
  const [erreur, setErreur] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const verifier = async () => {
      try {
        const res = await fetch(`/api/votes/statut/${params.transactionId}`);
        if (!res.ok) {
          setErreur(true);
          return;
        }
        const json: StatutReponse = await res.json();
        setData(json);

        // Une fois un statut définitif atteint, on arrête d'interroger le serveur.
        if (json.statut !== "PENDING" && json.statut !== "PAID" && intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } catch {
        setErreur(true);
      }
    };

    verifier();
    intervalRef.current = setInterval(verifier, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.transactionId]);

  const enAttente = !data || data.statut === "PENDING" || data.statut === "PAID";
  const succes = data?.statut === "PROCESSED";

  return (
    <main>
      <HeaderApp />
      <div className="px-4 pt-10 flex flex-col items-center text-center">
        {enAttente && !erreur ? (
          <>
            <div className="h-20 w-20 rounded-full border-4 border-pabo-border border-t-pabo-gold animate-spin mx-auto" />
            <p className="text-lg text-pabo-cream mt-5">Vérification du paiement…</p>
            <p className="text-sm text-pabo-muted mt-1.5">Un instant, ne fermez pas cette page.</p>
          </>
        ) : succes ? (
          <>
            <StatusIcon status="success" />
            <p className="text-lg text-pabo-cream mt-5">Vote enregistré</p>
            <p className="text-sm text-pabo-muted mt-1.5">
              {data?.nombreVotes} vote(s) pour {data?.candidat?.nom} — merci pour votre soutien !
            </p>
          </>
        ) : (
          <>
            <StatusIcon status="failed" />
            <p className="text-lg text-pabo-cream mt-5">Paiement non abouti</p>
            <p className="text-sm text-pabo-muted mt-1.5">Aucun montant n&apos;a été débité.</p>
          </>
        )}

        <div className="w-full max-w-xs mt-6">
          {succes ? (
            <Link href="/">
              <BoutonPrimaire variant="bordeaux">Retour au concours</BoutonPrimaire>
            </Link>
          ) : !enAttente ? (
            <Link href={data?.candidat?.slug ? `/candidat/${data.candidat.slug}` : "/"}>
              <BoutonPrimaire variant="gold" icon={<RotateCcw size={16} />}>Réessayer</BoutonPrimaire>
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
