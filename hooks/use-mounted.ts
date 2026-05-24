import { useEffect, useState } from "react";

export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // defer state update to avoid synchronous setState within effect
    const id = setTimeout(() => setMounted(true), 0);

    return () => clearTimeout(id);
  }, []);

  return mounted;
}
