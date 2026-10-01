import { createBrowserClient } from "@supabase/ssr";

/**
 * Client navigateur Supabase.
 * La connexion est optionnelle pendant le premier déploiement.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return createDisabledBrowserClient();
  }

  return createBrowserClient(url, key);
}

function createDisabledBrowserClient() {
  const erreur = new Error("Supabase n'est pas encore configuré.");
  return {
    auth: {
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: erreur }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: erreur }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  } as any;
}
