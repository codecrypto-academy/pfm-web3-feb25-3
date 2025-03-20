import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./clientLayout";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trazabilidad PFM-2025",
  description: "Sistema de trazabilidad para baterías de vehículos eléctricos utilizando tecnología blockchain",
  keywords: ["trazabilidad", "baterías", "vehículos eléctricos", "blockchain"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout> {/* ✅ Usamos ClientLayout como wrapper principal */}
          <Navbar /> {/* ✅ Incluimos el Navbar aquí */}
          <main>{children}</main> {/* ✅ Sección principal para el contenido */}
        </ClientLayout>
      </body>
    </html>
  );
}
