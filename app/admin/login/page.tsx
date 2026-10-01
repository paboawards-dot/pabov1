"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Authentification : email + mot de passe uniquement (choix confirmé, pas de MFA,
// un seul administrateur). Supabase Auth gère le hash du mot de passe et la session.
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErreur(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setErreur("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-admin-bg flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xs bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-sm font-medium text-admin-text text-center">Pabo awards — Administration</p>

        <div className="mt-5 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 px-3 rounded-lg border border-gray-300 text-sm outline-none focus:border-pabo-gold"
          />
          <input
            type="password"
            required
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 px-3 rounded-lg border border-gray-300 text-sm outline-none focus:border-pabo-gold"
          />
        </div>

        {erreur && <p className="text-xs text-red-600 mt-3">{erreur}</p>}
        {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <p className="text-[11px] text-gray-500 mt-3">Administration en attente de la connexion Supabase.</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full h-11 rounded-lg bg-pabo-gold text-admin-text text-sm font-medium
            flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <LogIn size={16} />
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  );
}
