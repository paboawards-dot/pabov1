"use client";

import { useAction } from "@/lib/useAction";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ id, action }: { id: string; action: (id: string) => Promise<void> }) {
  const [pending, startTransition] = useAction();

  return (
    <button
      onClick={() => {
        if (confirm("Confirmer la suppression ?")) {
          startTransition(() => action(id));
        }
      }}
      disabled={pending}
      className="h-8 w-8 rounded-lg border border-gray-300 text-gray-500 flex items-center justify-center disabled:opacity-50 shrink-0"
      aria-label="Supprimer"
    >
      <Trash2 size={14} />
    </button>
  );
}
