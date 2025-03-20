import Sidebar from '@/components/Sidebar';
import { Geist, Geist_Mono } from "next/font/google";
//import "./globals.css";

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
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className={`${geistSans.variable} ${geistMono.variable} antialiased flex-1 p-4 md:p-8 bg-[var(--dashboard-bg)] text-[var(--dashboard-text)]`}>
        {children}
      </main>
    </div>
  );
}
