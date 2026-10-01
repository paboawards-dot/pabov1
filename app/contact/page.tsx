"use client";

import { Phone, Copy, Facebook } from "lucide-react";
import HeaderApp from "@/components/HeaderApp";
import BoutonPrimaire from "@/components/BoutonPrimaire";
import BoutonSecondaire from "@/components/BoutonSecondaire";

const TELEPHONE = "07 18 27 57 97";

export default function ContactPage() {
  return (
    <main>
      <HeaderApp backHref="/menu" breadcrumb="Contact" />

      <div className="px-4 pt-6 flex flex-col items-center gap-1">
        <p className="text-2xl text-pabo-cream tracking-wide">{TELEPHONE}</p>
        <p className="text-xs text-pabo-muted">Présenté par Esprit Guerrier · Bounkani, Côte d&apos;Ivoire</p>
      </div>

      <div className="px-4 pt-6 flex flex-col gap-2.5 max-w-xs mx-auto">
        <a href={`tel:${TELEPHONE.replace(/\s/g, "")}`}>
          <BoutonPrimaire icon={<Phone size={18} />}>Appeler</BoutonPrimaire>
        </a>
        <BoutonSecondaire
          icon={<Copy size={16} />}
          onClick={() => navigator.clipboard?.writeText(TELEPHONE)}
        >
          Copier le numéro
        </BoutonSecondaire>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 h-12 rounded-pabo border border-pabo-border text-pabo-cream text-sm"
        >
          <Facebook size={16} /> Pabo awards sur Facebook
        </a>
      </div>
    </main>
  );
}
