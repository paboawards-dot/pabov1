import { Newspaper, Handshake, FileText, Info, Phone } from "lucide-react";
import HeaderApp from "@/components/HeaderApp";
import MenuListItem from "@/components/MenuListItem";

export default function MenuPage() {
  return (
    <main>
      <HeaderApp />
      <p className="px-4 pt-3 pb-1 text-lg text-pabo-cream">Menu</p>
      <div className="px-4">
        <MenuListItem href="/actualites" label="Actualités" icon={Newspaper} />
        <MenuListItem href="/partenaires" label="Partenaires" icon={Handshake} />
        <MenuListItem href="/reglement" label="Règlement" icon={FileText} />
        <MenuListItem href="/a-propos" label="À propos" icon={Info} />
        <MenuListItem href="/contact" label="Contact" icon={Phone} />
      </div>
    </main>
  );
}
