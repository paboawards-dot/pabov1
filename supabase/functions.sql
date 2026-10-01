-- ============================================================================
-- FONCTIONS SERVEUR — attribution atomique des votes (règle 11.4/11.12/12.7)
-- Appelées uniquement depuis le webhook CinetPay, via le client service_role
-- (lib/supabase/admin.ts). Jamais depuis le frontend.
-- ============================================================================

-- Marque une transaction comme réussie et crédite les votes du candidat,
-- de façon atomique. Idempotente : un second appel sur une transaction déjà
-- PROCESSED ne fait rien (empêche un double crédit si le webhook est reçu
-- plusieurs fois — règle 11.3/12.7).
create or replace function traiter_transaction_reussie(p_transaction_id uuid)
returns void as $$
declare
  v_candidat_id uuid;
  v_nombre_votes int;
  v_statut statut_transaction;
begin
  select candidat_id, nombre_votes, statut
    into v_candidat_id, v_nombre_votes, v_statut
  from transactions
  where id = p_transaction_id
  for update; -- verrou pour éviter une double exécution concurrente

  if not found then
    raise exception 'Transaction introuvable: %', p_transaction_id;
  end if;

  if v_statut = 'PROCESSED' then
    return; -- déjà traitée, on ne recrédite rien (idempotence)
  end if;

  update transactions
    set statut = 'PROCESSED', updated_at = now()
    where id = p_transaction_id;

  update candidats
    set votes_total = votes_total + v_nombre_votes
    where id = v_candidat_id;
end;
$$ language plpgsql security definer set search_path = public;

-- Marque une transaction comme échouée/annulée (aucun crédit de vote).
create or replace function marquer_transaction_echouee(p_transaction_id uuid, p_statut statut_transaction)
returns void as $$
begin
  if p_statut not in ('FAILED', 'CANCELLED', 'EXPIRED') then
    raise exception 'Statut d''échec invalide: %', p_statut;
  end if;

  update transactions
    set statut = p_statut, updated_at = now()
    where id = p_transaction_id and statut != 'PROCESSED'; -- ne jamais écraser un succès déjà traité
end;
$$ language plpgsql security definer set search_path = public;
