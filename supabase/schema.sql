-- ============================================================================
-- PABO AWARDS — Schéma Supabase (PostgreSQL)
-- Correspond au Bloc "Données" du cahier des charges.
-- À exécuter dans Supabase > SQL Editor, sur un projet neuf.
-- ============================================================================

-- Extension pour uuid_generate_v4()
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. CONCOURS
-- ----------------------------------------------------------------------------
create type statut_concours as enum (
  'BROUILLON', 'CANDIDATURES_OUVERTES', 'VOTE_OUVERT', 'VOTE_FERME', 'TERMINE'
);

create table concours (
  id uuid primary key default uuid_generate_v4(),
  nom text not null,
  annee int not null,
  statut statut_concours not null default 'BROUILLON',
  date_ouverture_candidatures date,
  date_ouverture_vote date,
  date_fermeture_vote date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. UNIVERS
-- ----------------------------------------------------------------------------
create table univers (
  id uuid primary key default uuid_generate_v4(),
  concours_id uuid not null references concours(id) on delete restrict,
  nom text not null,
  slug text not null unique,
  icone text,
  ordre_affichage int not null default 0
);

-- ----------------------------------------------------------------------------
-- 3. CATEGORIES
-- ----------------------------------------------------------------------------
create type statut_override_categorie as enum ('FERMEE_MANUELLEMENT', 'PROLONGATION');

create table categories (
  id uuid primary key default uuid_generate_v4(),
  univers_id uuid not null references univers(id) on delete restrict,
  nom text not null,
  slug text not null unique,
  description text,
  image_ambiance_url text,
  statut_override statut_override_categorie,
  motif_fermeture text, -- obligatoire si statut_override = FERMEE_MANUELLEMENT (vérifié côté appli/fonction)
  prolongation_fin timestamptz -- date de fin si statut_override = PROLONGATION
);

-- ----------------------------------------------------------------------------
-- 4. CANDIDATS
-- ----------------------------------------------------------------------------
create table candidats (
  id uuid primary key default uuid_generate_v4(),
  categorie_id uuid not null references categories(id) on delete restrict,
  nom text not null,
  slug text not null unique,
  photo_url text,
  description text,
  votes_total int not null default 0 check (votes_total >= 0),
  actif boolean not null default true
);

-- ----------------------------------------------------------------------------
-- 5. TRANSACTIONS
-- ----------------------------------------------------------------------------
create type operateur_paiement as enum ('ORANGE', 'MTN', 'MOOV', 'WAVE');
create type statut_transaction as enum (
  'PENDING', 'PAID', 'PROCESSED', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED'
);

create table transactions (
  id uuid primary key default uuid_generate_v4(),
  candidat_id uuid not null references candidats(id) on delete restrict,
  telephone text not null,
  operateur operateur_paiement not null,
  nombre_votes int not null check (nombre_votes > 0),
  montant int not null check (montant = nombre_votes * 100), -- 100 FCFA/vote (cf. règlement)
  reference_cinetpay text unique,
  statut statut_transaction not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_transactions_candidat on transactions(candidat_id);
create index idx_transactions_statut on transactions(statut);

-- ----------------------------------------------------------------------------
-- 6. PAIEMENT_WEBHOOK_LOG
-- ----------------------------------------------------------------------------
create table paiement_webhook_log (
  id uuid primary key default uuid_generate_v4(),
  transaction_id uuid references transactions(id) on delete restrict,
  payload_brut jsonb not null,
  signature_valide boolean not null default false,
  traite boolean not null default false,
  recu_le timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. ADMINS (métadonnées ; l'auth elle-même passe par Supabase Auth)
-- ----------------------------------------------------------------------------
create type role_admin as enum ('ADMIN', 'SUPER_ADMIN');

create table admins (
  id uuid primary key references auth.users(id) on delete cascade,
  nom text,
  email text unique not null,
  role role_admin not null default 'ADMIN'
);

-- ----------------------------------------------------------------------------
-- 8. AUDIT_LOG (jamais modifiable après écriture — appliqué via policies RLS)
-- ----------------------------------------------------------------------------
create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references admins(id) on delete set null,
  type_action text not null,
  cible_type text,
  cible_id uuid,
  ancienne_valeur jsonb,
  nouvelle_valeur jsonb,
  resultat text,
  date timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 9. ACTUALITES & PARTENAIRES
-- ----------------------------------------------------------------------------
create table actualites (
  id uuid primary key default uuid_generate_v4(),
  titre text not null,
  image_url text,
  contenu text,
  date_publication date not null default current_date,
  ordre_carrousel int not null default 0
);

create table partenaires (
  id uuid primary key default uuid_generate_v4(),
  nom text not null,
  logo_url text,
  role text not null,
  description text,
  ordre_affichage int not null default 0
);

-- ============================================================================
-- ROW LEVEL SECURITY (règle 11.6 du cahier des charges)
-- ============================================================================

alter table concours enable row level security;
alter table univers enable row level security;
alter table categories enable row level security;
alter table candidats enable row level security;
alter table transactions enable row level security;
alter table paiement_webhook_log enable row level security;
alter table admins enable row level security;
alter table audit_log enable row level security;
alter table actualites enable row level security;
alter table partenaires enable row level security;

-- Lecture publique (visiteurs) sur les données non sensibles ---------------
create policy "public_read_concours" on concours for select using (true);
create policy "public_read_univers" on univers for select using (true);
create policy "public_read_categories" on categories for select using (true);
create policy "public_read_candidats" on candidats for select using (true);
create policy "public_read_actualites" on actualites for select using (true);
create policy "public_read_partenaires" on partenaires for select using (true);

-- Transactions : aucune lecture/écriture publique directe.
-- Toute lecture/écriture passe par des fonctions serveur (service role),
-- jamais par le rôle "anon" du frontend (cf. règle 11.4/11.14).
-- Aucune policy select/insert/update n'est créée pour le rôle anon ici.

-- Admins : un admin ne voit que sa propre ligne.
create policy "admin_read_self" on admins for select using (auth.uid() = id);

-- Écritures admin (concours, catégories, candidats, actualités, partenaires) :
-- réservées aux utilisateurs authentifiés présents dans la table admins.
create policy "admin_write_concours" on concours for update using (
  exists (select 1 from admins where admins.id = auth.uid())
);
create policy "admin_write_categories" on categories for update using (
  exists (select 1 from admins where admins.id = auth.uid())
);
create policy "admin_write_candidats" on candidats for all using (
  exists (select 1 from admins where admins.id = auth.uid())
);
create policy "admin_write_actualites" on actualites for all using (
  exists (select 1 from admins where admins.id = auth.uid())
);
create policy "admin_write_partenaires" on partenaires for all using (
  exists (select 1 from admins where admins.id = auth.uid())
);

-- Audit log : lecture par les admins uniquement, AUCUNE policy update/delete
-- n'est créée volontairement (règle 11.13 : jamais modifiable une fois écrit).
create policy "admin_read_audit" on audit_log for select using (
  exists (select 1 from admins where admins.id = auth.uid())
);
-- Les admins peuvent AJOUTER une entrée d'audit (jamais la modifier/supprimer,
-- aucune policy update/delete n'existe pour cette table — conforme à 11.13).
create policy "admin_insert_audit" on audit_log for insert with check (
  exists (select 1 from admins where admins.id = auth.uid())
);

-- Transactions : lecture réservée aux admins (règle "lecture seule" du back-office).
create policy "admin_read_transactions" on transactions for select using (
  exists (select 1 from admins where admins.id = auth.uid())
);

-- ============================================================================
-- NOTE IMPORTANTE
-- ============================================================================
-- Les opérations suivantes ne doivent JAMAIS passer par le client Supabase
-- côté navigateur (clé "anon"), uniquement par du code serveur utilisant la
-- clé "service_role" (jamais exposée au frontend, cf. règle 11.9/12.1) :
--   - création d'une transaction (statut PENDING)
--   - traitement du webhook CinetPay (passage à PROCESSED + incrément votes_total)
--   - toute correction manuelle de votes (doit être une fonction dédiée, tracée)
