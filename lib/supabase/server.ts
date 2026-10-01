import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./config";

/**
 * Client Supabase côté serveur.
 *
 * Si Supabase n'est pas encore configuré, on utilise un client inactif qui
 * renvoie des résultats vides au lieu de faire échouer le build ou le site.
 * Cela permet de publier le frontend avant de connecter la base.
 */
export function createServerSupabase() {
  if (!isSupabaseConfigured()) return createDisabledSupabaseClient();

  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {}
        },
      },
    }
  );
}

/** Client local sans connexion : toutes les lectures retournent des données vides. */
function createDisabledSupabaseClient() {
  const emptyResult = {
    data: [],
    error: null,
    count: 0,
  };

  const chain: any = {
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    delete: () => chain,
    upsert: () => chain,
    eq: () => chain,
    neq: () => chain,
    gt: () => chain,
    gte: () => chain,
    lt: () => chain,
    lte: () => chain,
    in: () => chain,
    is: () => chain,
    ilike: () => chain,
    like: () => chain,
    or: () => chain,
    and: () => chain,
    order: () => chain,
    limit: () => chain,
    range: () => chain,
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: (resolve: (value: typeof emptyResult) => unknown) =>
      Promise.resolve(emptyResult).then(resolve),
  };

  return {
    from: () => chain,
    rpc: async () => ({ data: null, error: null }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
  } as any;
}
