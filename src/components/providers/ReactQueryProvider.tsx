"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname } from "next/navigation";

type RQProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();
export default function ReactQueryProvider({ children }: RQProviderProps) {
  const pathname = usePathname();
  const isDashboardRoutes = pathname.includes("/dashboard");
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition={isDashboardRoutes ? "bottom-right" : "bottom-left"}
      />
    </QueryClientProvider>
  );
}
