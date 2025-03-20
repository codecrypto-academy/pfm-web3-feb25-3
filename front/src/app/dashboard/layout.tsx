import Sidebar from '@/components/Sidebar';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar ocupa el alto completo pero no se expande */}
      <Sidebar />
      {/* Contenedor principal ocupa el resto del espacio */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
