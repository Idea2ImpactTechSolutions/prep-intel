import type { Metadata } from "next";
import { Inter, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const barlow = Barlow_Semi_Condensed({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Prep Intel Admin",
  description: "Prep Intel Administration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} ${barlow.className}`}>
        {children}
      </body>
    </html>
  );
}
