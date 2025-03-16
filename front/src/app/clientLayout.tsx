"use client";

import { useEffect } from "react";
import setupAxiosInterceptor from "./config/axiosInterceptor";
import { AuthProvider } from "./context/AuthContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupAxiosInterceptor(); // Configurar interceptor global
  }, []);

  return (
    <AuthProvider> {/* ✅ Envolvemos toda la app con el contexto de autenticación */}
      {children}
    </AuthProvider>
  );
}
