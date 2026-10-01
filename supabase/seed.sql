-- ============================================================================
-- PABO AWARDS — Données initiales
-- À exécuter une fois après schema.sql. Les noms de catégories ci-dessous
-- sont des PLACEHOLDERS (seul le total 6+5+4+3+1 = 19 est confirmé) —
-- renommez-les depuis Supabase Table Editor en attendant un écran d'édition
-- dédié dans le back-office.
-- ============================================================================

insert into concours (nom, annee, statut, date_ouverture_candidatures, date_ouverture_vote, date_fermeture_vote)
values ('Pabo awards 2026', 2026, 'BROUILLON', '2026-10-06', '2026-11-06', '2026-12-06');

-- Récupère l'id du concours qu'on vient de créer
do $$
declare
  v_concours_id uuid;
  v_univers_id uuid;
begin
  select id into v_concours_id from concours where annee = 2026 limit 1;

  -- 1. Musique & Arts (6 catégories)
  insert into univers (concours_id, nom, slug, icone, ordre_affichage)
  values (v_concours_id, 'Musique & Arts', 'musique-arts', 'music', 1)
  returning id into v_univers_id;
  insert into categories (univers_id, nom, slug) values
    (v_univers_id, 'Catégorie musique 1 (à renommer)', 'musique-1'),
    (v_univers_id, 'Catégorie musique 2 (à renommer)', 'musique-2'),
    (v_univers_id, 'Catégorie musique 3 (à renommer)', 'musique-3'),
    (v_univers_id, 'Catégorie musique 4 (à renommer)', 'musique-4'),
    (v_univers_id, 'Catégorie musique 5 (à renommer)', 'musique-5'),
    (v_univers_id, 'Catégorie musique 6 (à renommer)', 'musique-6');

  -- 2. Culture & Événementiel (5 catégories)
  insert into univers (concours_id, nom, slug, icone, ordre_affichage)
  values (v_concours_id, 'Culture & Événementiel', 'culture-evenementiel', 'mask', 2)
  returning id into v_univers_id;
  insert into categories (univers_id, nom, slug) values
    (v_univers_id, 'Catégorie culture 1 (à renommer)', 'culture-1'),
    (v_univers_id, 'Catégorie culture 2 (à renommer)', 'culture-2'),
    (v_univers_id, 'Catégorie culture 3 (à renommer)', 'culture-3'),
    (v_univers_id, 'Catégorie culture 4 (à renommer)', 'culture-4'),
    (v_univers_id, 'Catégorie culture 5 (à renommer)', 'culture-5');

  -- 3. Digital & Médias (4 catégories)
  insert into univers (concours_id, nom, slug, icone, ordre_affichage)
  values (v_concours_id, 'Digital & Médias', 'digital-medias', 'device-mobile', 3)
  returning id into v_univers_id;
  insert into categories (univers_id, nom, slug) values
    (v_univers_id, 'Catégorie digital 1 (à renommer)', 'digital-1'),
    (v_univers_id, 'Catégorie digital 2 (à renommer)', 'digital-2'),
    (v_univers_id, 'Catégorie digital 3 (à renommer)', 'digital-3'),
    (v_univers_id, 'Catégorie digital 4 (à renommer)', 'digital-4');

  -- 4. Nightlife & Entrepreneuriat (3 catégories)
  insert into univers (concours_id, nom, slug, icone, ordre_affichage)
  values (v_concours_id, 'Nightlife & Entrepreneuriat', 'nightlife-entrepreneuriat', 'glass-cocktail', 4)
  returning id into v_univers_id;
  insert into categories (univers_id, nom, slug) values
    (v_univers_id, 'Catégorie nightlife 1 (à renommer)', 'nightlife-1'),
    (v_univers_id, 'Catégorie nightlife 2 (à renommer)', 'nightlife-2'),
    (v_univers_id, 'Catégorie nightlife 3 (à renommer)', 'nightlife-3');

  -- 5. Rayonnement International (1 catégorie)
  insert into univers (concours_id, nom, slug, icone, ordre_affichage)
  values (v_concours_id, 'Rayonnement International', 'rayonnement-international', 'world', 5)
  returning id into v_univers_id;
  insert into categories (univers_id, nom, slug) values
    (v_univers_id, 'Catégorie rayonnement international (à renommer)', 'rayonnement-1');
end $$;

-- Actualités et partenaire de démonstration
insert into actualites (titre, contenu, date_publication, ordre_carrousel) values
  ('Ouverture du vote le 6 novembre', 'Le vote public ouvre le 6 novembre 2026 et dure un mois.', '2026-10-06', 1),
  ('19 catégories, 5 univers à découvrir', 'Musique & Arts, Culture & Événementiel, Digital & Médias, Nightlife & Entrepreneuriat et Rayonnement International.', '2026-10-08', 2);

insert into partenaires (nom, role, description, ordre_affichage) values
  ('Esprit Guerrier', 'Présentateur', 'Organisateur du projet Pabo awards.', 1);

-- ============================================================================
-- IMPORTANT : après avoir créé votre compte admin dans Supabase Auth
-- (Authentication → Users → Add user), ajoutez-le à la table `admins` :
--
--   insert into admins (id, nom, email)
--   values ('<uuid de l''utilisateur créé>', 'Votre nom', 'votre@email.com');
--
-- Sans cette ligne, la connexion réussira mais les écrans admin resteront
-- vides (les policies RLS exigent une entrée dans `admins`).
-- ============================================================================
