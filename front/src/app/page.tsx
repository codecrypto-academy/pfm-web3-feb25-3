'use client';

import { useState } from 'react';

import Navbar from '@/components/Navbar';

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [serialNumber, setSerialNumber] = useState('');

  // Función para manejar la búsqueda de la batería
  const handleSearch = () => {
    if (serialNumber) {
      console.log(`Buscando batería con serialNumber: ${serialNumber}`);
      // Aquí puedes agregar la lógica para buscar la batería
      // Por ejemplo, llamar a una API o consultar la base de datos
    } else {
      alert('Por favor, ingresa un número de serie');
    }
  };

  return (
    <div className="relative grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar /> {/* Incluimos el Navbar aquí */}
      
      <header className="row-start-1 w-full text-center mb-8">
        <h1 className="text-3xl font-bold sm:text-left">
          Proyecto de Fin de Máster
        </h1>
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center justify-center w-full">
        
        {/* Búsqueda de serialNumber */}
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Buscar Batería</h2>
          <div className="flex justify-center mb-4">
            <input
              type="text"
              placeholder="Ingresa el serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-4/5 sm:w-1/2 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSearch}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Aquí podrías mostrar los resultados de la búsqueda, por ejemplo, los detalles de la batería */}
        {/* <BatteryHistory /> o cualquier componente para mostrar resultados */}

      </main>

      <footer className="row-start-3 text-2xl font-bold text-center sm:text-left">
        <p>© {currentYear} PFM-2025 CodeCrypto.</p>
      </footer>
    </div>
  );
}
