"use client";

import { useAction } from "@/lib/useAction";
import { basculerActifCandidat } from "@/app/admin/actions";

export default function CandidatRowActions({ candidatId, actif }: { candidatId: string; actif: boolean }) {
  const [pending, startTransition] = useAction();

  return (
    <button
      onClick={() => startTransition(() => basculerActifCandidat(candidatId, !actif))}
      disabled={pending}
      className="text-[11px] px-2.5 py-1 rounded-md border border-gray-300 text-gray-600 disabled:opacity-50"
    >
      {actif ? "Désactiver" : "Réactiver"}
    </button>
  );
}
