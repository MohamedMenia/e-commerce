"use client";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";
import { useState } from "react";
import StoreProvider from "@/redux/storeProvider";
import FetchUser from "@/components/FetchUser";
import { ToastContainer } from "react-toastify";

interface ClientProvidersProps {
  pageProps: { dehydratedState: DehydratedState };
  children: React.ReactNode;
}

const ClientProviders = ({ pageProps, children }: ClientProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps?.dehydratedState}>
        <StoreProvider>
          <FetchUser />
          {children}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </StoreProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
};

export default ClientProviders;
