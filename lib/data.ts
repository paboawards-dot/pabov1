// Ce fichier ne contient plus de données factices : toutes les données
// (univers, catégories, candidats, actualités, partenaires) viennent
// maintenant de Supabase. Il ne reste ici que ce qui est encore partagé.

// Prix affiché dans l'interface. Attention : ce n'est QUE de l'affichage —
// le montant réellement facturé est toujours recalculé côté serveur
// (app/api/votes/creer/route.ts) et contraint en base (CHECK sur transactions).
export const PRIX_VOTE_FCFA = 100;

export type Partenaire = {
  id: string;
  nom: string;
  role: string;
  description?: string | null;
  logo_url?: string | null;
};
