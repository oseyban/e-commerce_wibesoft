"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import "../lib/api";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
      },
    },
  });

export const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
