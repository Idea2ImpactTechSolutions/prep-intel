import type { Metadata } from "next";
import { Inter, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import AppProvider from "@/components/provider";
import { AuthProvider } from "@/components/provider/AuthProvider";

const inter = Inter({ subsets: ["latin"] });
const barlow = Barlow_Semi_Condensed({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Prep intel",
  description: "Welcome to Prep Intel, your trusted partner in finding the perfect college. We leverage advanced technology to simplify your college search process.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} ${barlow.className}`}>
        <AppProvider>
        <AuthProvider>{children}</AuthProvider>
        </AppProvider>
        <Toaster position="top-right" richColors closeButton/>
      </body>
    </html>
  );
}
