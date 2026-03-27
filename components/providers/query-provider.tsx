"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}

// useState: Returns a stateful value, and a function to update it.

// React query is so easy to implement and but its intial is quite difficult to understand

// But it's power of react query - make applications so much optimised
