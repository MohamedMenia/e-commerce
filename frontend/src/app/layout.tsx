import { QueryClient, dehydrate } from "@tanstack/react-query";
import Navbar from "@/components/header/NavBar";
import { getUser } from "@/axios/userAPIS";
import ClientProviders from "@/components/ClientProviders";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Shop",
  icons: {
    icon: "/ecommerce.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["user"], queryFn: getUser });
  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="en">
      <body
        className="min-h-screen bg-main-gradient text-primaryFont antialiased"
        suppressHydrationWarning
      >
        <ClientProviders pageProps={{ dehydratedState }}>
          <Navbar />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
