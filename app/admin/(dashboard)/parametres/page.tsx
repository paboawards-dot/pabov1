import { createServerSupabase } from "@/lib/supabase/server";
import ChangerMotDePasseForm from "@/components/admin/ChangerMotDePasseForm";

export default async function AdminParametresPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-lg font-medium text-admin-text">Paramètres</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
        <p className="text-xs text-gray-500">Email du compte</p>
        <p className="text-sm text-admin-text mt-1">{user?.email}</p>
        <p className="text-[11px] text-gray-400 mt-2">
          Pour changer l&apos;email, utilisez le tableau de bord Supabase (Authentication → Users).
        </p>
      </div>

      <ChangerMotDePasseForm />
    </div>
  );
}
