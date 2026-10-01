// Ces types reflètent directement les colonnes de supabase/schema.sql
// (snake_case, comme en base) pour éviter tout mapping superflu entre
// les requêtes Supabase et les composants.

export type Univers = {
  id: string;
  slug: string;
  nom: string;
  icone: string;
  ordre_affichage?: number;
};

export type Categorie = {
  id: string;
  slug: string;
  univers_id: string;
  nom: string;
  image_ambiance_url?: string | null;
  statut_override?: "FERMEE_MANUELLEMENT" | "PROLONGATION" | null;
  motif_fermeture?: string | null;
  prolongation_fin?: string | null;
};

export type Candidat = {
  id: string;
  slug: string;
  categorie_id: string;
  nom: string;
  photo_url?: string | null;
  video_url?: string | null;
  description?: string | null;
  votes_total: number;
  actif: boolean;
};

export type Actualite = {
  id: string;
  titre: string;
  contenu?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  date_publication: string;
  ordre_carrousel?: number;
};

// Statuts de transaction — cf. cahier des charges, Bloc Logique / Sécurité (règle 11.11)
export type StatutTransaction =
  | "PENDING"
  | "PAID"
  | "PROCESSED"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUNDED";

export type Operateur = "ORANGE" | "MTN" | "MOOV" | "WAVE";
