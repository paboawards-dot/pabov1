import { createClient } from "@supabase/supabase-js";
import { isSupabaseAdminConfigured } from "./config";

// ⚠️ Clé service_role : contourne toutes les policies RLS.
// À utiliser UNIQUEMENT dans du code serveur (Route Handlers, Server Actions).
// JAMAIS importé depuis un composant client.
//
// Supabase est optionnel au premier déploiement : vérifier
// isSupabaseAdminConfigured() avant d'appeler cette fonction.
export function createAdminClient() {
  if (!isSupabaseAdminConfigured()) {
    throw new Error("Supabase n'est pas encore configuré (variables d'environnement manquantes).");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
