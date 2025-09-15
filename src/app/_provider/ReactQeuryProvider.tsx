'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const showDevtools =
    process.env.NEXT_PUBLIC_REACT_QUERY_DEVTOOLS === 'true' &&
    !['main', 'prototype'].includes(process.env.NEXT_PUBLIC_BRANCH_NAME!);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
