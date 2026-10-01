# Pabo awards — Prix de l'art du Bounkani

Premier squelette Next.js du site de vote, basé sur le cahier des charges (Blocs Pages, Composants, Navigation, Données, Logique).

## Démarrer le projet

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

## Configurer Supabase (base de données + authentification admin)

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécuter dans l'ordre :
   - `supabase/schema.sql` (tables, contraintes, Row Level Security)
   - `supabase/seed.sql` (concours 2026, 5 univers, 19 catégories placeholders à renommer, actualités et partenaire de démo)
3. Dans **Authentication → Users**, créer le compte admin unique (email + mot de passe).
4. Toujours dans SQL Editor, lier ce compte à la table `admins` (remplacer les valeurs) :
   ```sql
   insert into admins (id, nom, email)
   values ('<uuid de l''utilisateur créé ci-dessus>', 'Votre nom', 'votre@email.com');
   ```
   Sans cette ligne, la connexion admin fonctionne mais les écrans restent vides (RLS l'exige).
5. Copier `.env.example` vers `.env.local` et remplir avec les clés du projet Supabase (Settings → API) :
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (clé publique)
   - `SUPABASE_SERVICE_ROLE_KEY` (clé privée — jamais commitée, jamais utilisée côté frontend)

## Back-office admin (`/admin`)
Accessible une fois Supabase configuré ci-dessus. Écrans codés :
- **Tableau de bord** — KPI (votes, revenus, candidats actifs, transactions en attente) + statut du concours avec changement direct (c'est la manœuvre d'ouverture/fermeture)
- **Concours** — dates clés + historique des changements de statut
- **Univers & catégories** — fermeture manuelle avec motif obligatoire (fraude), ou prolongation 48h (égalité), ou réouverture
- **Candidats** — ajout et activation/désactivation (le compteur de votes n'est jamais éditable manuellement)
- **Transactions** — lecture seule, filtrable par statut
- **Paiements & revenus** — calcul automatique du 50/50 par catégorie + export CSV
- **Journal d'audit** — lecture seule, chaque action admin y est tracée automatiquement
- **Actualités** / **Partenaires** — ajout et suppression
- **Paramètres** — changement du mot de passe

Le site public (`lib/data.ts`) utilise toujours des données de démonstration statiques — le brancher sur Supabase (comme l'admin) est la prochaine étape logique.

## Ce qui est déjà fonctionnel (avec données de démonstration)
Toutes les pages publiques du cahier des charges sont codées :
- **Accueil** : carrousel d'actualités auto (3s) + grille des 5 univers
- **Univers** → **Catégorie** (grille de candidats) → **Candidat** (vote + classement local)
- **Paiement** (récapitulatif + choix d'opérateur, visuel) → **Confirmation** (succès/échec)
- **Classement général** (filtres par catégorie + podium top 3)
- **Artistes** (répertoire global avec recherche en direct)
- **Menu**, **Actualités** (liste + détail), **Partenaires**, **Règlement** (sommaire ancré), **À propos**, **Contact**
- Barre de navigation basse (masquée sur Paiement/Confirmation)
- Design system respecté : couleurs, composants nommés exactement comme dans le cahier des charges

## Simplifications à connaître (pas des bugs)
- Le bouton "Voter" sur les cartes candidats renvoie vers la fiche complète, plutôt que d'ouvrir `QuantiteModal` en superposition (Bloc Composants) — à ajouter si vous voulez ce raccourci.
- La page Paiement ne contacte pas encore CinetPay — les boutons opérateurs sont visuels.
- La page Confirmation lit un `?statut=` dans l'URL pour la démo, au lieu d'interroger une vraie transaction en base.

## Statut du projet
Le cahier des charges est maintenant entièrement implémenté : site public + back-office branchés sur Supabase, intégration CinetPay réelle (création de transaction, webhook vérifié server-to-server, attribution atomique des votes), PWA complète (icônes générées à partir du vrai logo, service worker, page hors-ligne), et vote rapide en superposition (`QuantiteModal`) depuis les grilles.

## Ce qui reste, au choix (rien de bloquant)
1. **Upload de photos** (candidats, actualités, partenaires) — prévoir Supabase Storage ; les champs `photo_url`/`logo_url`/`image_url` existent déjà en base, il ne manque que l'interface d'upload dans le back-office (actuellement, ces champs se remplissent en collant une URL d'image directement dans Supabase Table Editor)
2. **Renommer les 19 catégories** — `supabase/seed.sql` les crée avec des noms placeholders (seul le total 6+5+4+3+1 était confirmé) ; à renommer une fois les vraies catégories connues
3. **Tester en conditions réelles avec CinetPay** : basculer les clés `.env.local` en mode production une fois les tests sandbox validés (cf. règle de sécurité 12.14 — jamais de clé de prod utilisée pour tester)
4. **Vérification HMAC du webhook** : la vérification actuelle repose sur le rappel serveur-à-serveur `payment/check` (la source de vérité selon la doc CinetPay) ; l'ajout de la vérification `x-token` HMAC en couche supplémentaire est documenté mais pas implémenté ici, faute de spécification exacte de l'algorithme dans la documentation publique

## Variables d'environnement
Copier `.env.example` vers `.env.local` et remplir les clés CinetPay (jamais commiter `.env.local`).
