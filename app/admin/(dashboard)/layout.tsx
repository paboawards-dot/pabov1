import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

// Back-office : fond clair, pleine largeur (le cadre mobile du site public est
// désactivé pour /admin dans components/PublicShell.tsx).
//
// Sécurité (règle 11.17 : authentification + autorisation + vérification serveur) :
// on revérifie ici la session, en plus du middleware. L'accès aux données reste
// de toute façon protégé par les policies RLS de Supabase.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-admin-bg flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 text-center">
          <h1 className="text-lg font-medium text-admin-text">Administration non configurée</h1>
          <p className="text-sm text-gray-500 mt-2">
            La connexion Supabase n&apos;est pas encore activée. Le site public peut être publié,
            mais le back-office restera indisponible jusqu&apos;à la configuration de Supabase.
          </p>
        </div>
      </div>
    );
  }

  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Être connecté ne suffit pas : le compte doit aussi figurer dans la table admins.
  const { data: admin } = await supabase.from("admins").select("id").eq("id", user.id).maybeSingle();
  if (!admin) {
    return (
      <div className="min-h-screen bg-admin-bg flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 text-center">
          <h1 className="text-lg font-medium text-admin-text">Accès refusé</h1>
          <p className="text-sm text-gray-500 mt-2">
            Ce compte n&apos;est pas autorisé à accéder à l&apos;administration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-admin-bg flex flex-col md:flex-row">
      <AdminNav />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
