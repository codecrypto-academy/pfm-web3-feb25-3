'use client';

import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from 'next/navigation';

export default function Exit() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full mt-80">
      <div className="w-full max-w-2xl mx-4 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          ¿Está seguro que desea desconectarse?
        </h1>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            No
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
}
