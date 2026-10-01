import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <WifiOff size={40} className="text-pabo-muted" />
      <p className="text-lg text-pabo-cream mt-4">Pas de connexion</p>
      <p className="text-sm text-pabo-muted mt-1.5">
        Vérifiez votre connexion internet, puis réessayez.
      </p>
    </main>
  );
}
