"use client";

import { useCallback, useState } from "react";

// Équivalent de useTransition pour des actions asynchrones (Server Actions).
// Les types de React 18 n'acceptent pas un callback async dans startTransition,
// ce qui fait échouer `next build` ; ce hook expose la même forme d'utilisation :
//   const [pending, run] = useAction();
//   run(async () => { await monActionServeur(); });
export function useAction(): [boolean, (fn: () => Promise<unknown>) => void] {
  const [pending, setPending] = useState(false);

  const run = useCallback((fn: () => Promise<unknown>) => {
    setPending(true);
    fn()
      .catch((e) => console.error("Action échouée :", e))
      .finally(() => setPending(false));
  }, []);

  return [pending, run];
}
