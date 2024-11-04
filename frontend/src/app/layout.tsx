import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import StoreProvider from "@/redux/storeProvider";
import Navbar from "@/components/header/NavBar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "My Shop",
  icons: {
    icon: "/ecommerce.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} bg-main-gradient text-primaryFont antialiased`}
      >
        <StoreProvider>
          <Navbar />
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
      </body>
    </html>
  );
}
