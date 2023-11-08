"use client";
import { QueryClientProvider, QueryClient } from "react-query";
const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, //how times to retry if we face error
      refetchInterval: 1 * 60 * 60 * 1000, //each 1hour re-fetch data
      // staleTime: 5 * 60 * 1000, //5min ... till 5min use cached-data
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      useErrorBoundary: false,
    },
  },
});
export default function ReactQuery({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </>
  );
}
