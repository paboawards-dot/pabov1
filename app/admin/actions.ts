"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

// Toutes ces actions s'exécutent côté serveur, dans le contexte de la session
// admin authentifiée (RLS via Supabase Auth — cf. schema.sql). Chaque mutation
// écrit une ligne dans audit_log (règle 11.13 : jamais modifiable après coup).

async function ecrireAudit(
  typeAction: string,
  cibleType: string,
  cibleId: string | null,
  ancienneValeur: unknown,
  nouvelleValeur: unknown,
  resultat: string
) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("audit_log").insert({
    admin_id: user?.id ?? null,
    type_action: typeAction,
    cible_type: cibleType,
    cible_id: cibleId,
    ancienne_valeur: ancienneValeur,
    nouvelle_valeur: nouvelleValeur,
    resultat,
  });
}

// ---------------------------------------------------------------------------
// CONCOURS
// ---------------------------------------------------------------------------
export async function changerStatutConcours(concoursId: string, statut: string, statutPrecedent: string) {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("concours").update({ statut, updated_at: new Date().toISOString() }).eq("id", concoursId);

  await ecrireAudit(
    "changement_statut_concours",
    "concours",
    concoursId,
    { statut: statutPrecedent },
    { statut },
    error ? `echec: ${error.message}` : "succes"
  );

  revalidatePath("/admin");
  revalidatePath("/admin/concours");
  if (error) throw new Error(error.message);
}

export async function mettreAJourDatesConcours(concoursId: string, dates: {
  date_ouverture_candidatures?: string;
  date_ouverture_vote?: string;
  date_fermeture_vote?: string;
}) {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("concours").update({ ...dates, updated_at: new Date().toISOString() }).eq("id", concoursId);

  await ecrireAudit("modification_dates_concours", "concours", concoursId, null, dates, error ? `echec: ${error.message}` : "succes");

  revalidatePath("/admin/concours");
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// CATEGORIES — fermeture manuelle (fraude) / prolongation (égalité)
// ---------------------------------------------------------------------------
export async function fermerCategorie(categorieId: string, motif: string) {
  if (!motif.trim()) throw new Error("Un motif est obligatoire pour fermer une catégorie.");
  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("categories")
    .update({ statut_override: "FERMEE_MANUELLEMENT", motif_fermeture: motif })
    .eq("id", categorieId);

  await ecrireAudit("fermeture_categorie", "categorie", categorieId, null, { motif }, error ? `echec: ${error.message}` : "succes");

  revalidatePath("/admin/categories");
  if (error) throw new Error(error.message);
}

export async function prolongerCategorie(categorieId: string, finIso: string) {
  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("categories")
    .update({ statut_override: "PROLONGATION", prolongation_fin: finIso })
    .eq("id", categorieId);

  await ecrireAudit("prolongation_categorie", "categorie", categorieId, null, { prolongation_fin: finIso }, error ? `echec: ${error.message}` : "succes");

  revalidatePath("/admin/categories");
  if (error) throw new Error(error.message);
}

export async function reouvrirCategorie(categorieId: string) {
  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("categories")
    .update({ statut_override: null, motif_fermeture: null, prolongation_fin: null })
    .eq("id", categorieId);

  await ecrireAudit("reouverture_categorie", "categorie", categorieId, null, null, error ? `echec: ${error.message}` : "succes");

  revalidatePath("/admin/categories");
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// CANDIDATS — jamais de modification directe de votes_total ici (règle 11.4/11.14)
// ---------------------------------------------------------------------------
export async function creerCandidat(data: { categorie_id: string; nom: string; slug: string; photo_url?: string; video_url?: string; description?: string }) {
  const supabase = createServerSupabase();
  const { error, data: candidat } = await supabase.from("candidats").insert(data).select().single();

  await ecrireAudit("creation_candidat", "candidat", candidat?.id ?? null, null, data, error ? `echec: ${error.message}` : "succes");

  revalidatePath("/admin/candidats");
  if (error) throw new Error(error.message);
}

export async function modifierCandidat(id: string, data: { nom?: string; photo_url?: string; video_url?: string; description?: string; categorie_id?: string }) {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("candidats").update(data).eq("id", id);

  await ecrireAudit("modification_candidat", "candidat", id, null, data, error ? `echec: ${error.message}` : "succes");

  revalidatePath("/admin/candidats");
  if (error) throw new Error(error.message);
}

export async function basculerActifCandidat(id: string, actif: boolean) {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("candidats").update({ actif }).eq("id", id);

  await ecrireAudit(actif ? "activation_candidat" : "desactivation_candidat", "candidat", id, null, { actif }, error ? `echec: ${error.message}` : "succes");

  revalidatePath("/admin/candidats");
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// ACTUALITÉS
// ---------------------------------------------------------------------------
export async function creerActualite(data: { titre: string; contenu?: string; image_url?: string; video_url?: string; ordre_carrousel?: number }) {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("actualites").insert(data);
  await ecrireAudit("creation_actualite", "actualite", null, null, data, error ? `echec: ${error.message}` : "succes");
  revalidatePath("/admin/actualites");
  if (error) throw new Error(error.message);
}

export async function supprimerActualite(id: string) {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("actualites").delete().eq("id", id);
  await ecrireAudit("suppression_actualite", "actualite", id, null, null, error ? `echec: ${error.message}` : "succes");
  revalidatePath("/admin/actualites");
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// PARTENAIRES
// ---------------------------------------------------------------------------
export async function creerPartenaire(data: { nom: string; role: string; description?: string; logo_url?: string }) {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("partenaires").insert(data);
  await ecrireAudit("creation_partenaire", "partenaire", null, null, data, error ? `echec: ${error.message}` : "succes");
  revalidatePath("/admin/partenaires");
  if (error) throw new Error(error.message);
}

export async function supprimerPartenaire(id: string) {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("partenaires").delete().eq("id", id);
  await ecrireAudit("suppression_partenaire", "partenaire", id, null, null, error ? `echec: ${error.message}` : "succes");
  revalidatePath("/admin/partenaires");
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// PARAMÈTRES — email / mot de passe du compte admin unique
// ---------------------------------------------------------------------------
export async function changerMotDePasse(nouveauMotDePasse: string) {
  const supabase = createServerSupabase();
  const { error } = await supabase.auth.updateUser({ password: nouveauMotDePasse });
  await ecrireAudit("changement_mot_de_passe", "admin", null, null, null, error ? `echec: ${error.message}` : "succes");
  if (error) throw new Error(error.message);
}
