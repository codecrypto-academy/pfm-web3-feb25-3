'use client';

import { useState } from 'react';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] gap-16">      
      <header className="w-full text-center sm:text-left">
        <h1 className="text-3xl font-bold text-center">Proyecto de Fin de Máster</h1>
      </header>

      <main className="flex flex-col items-center justify-center w-full max-w-2xl bg-gray-900 p-8 rounded-xl shadow-lg">        
        <h2 className="text-2xl font-semibold mb-4">Buscar Batería</h2>
        <div className="flex flex-col sm:flex-row w-full gap-6">
          <input
            type="text"
            placeholder="Ingresa el Número de Serie"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="w-full sm:w-2/3 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Buscar
          </button>
        </div>
      </main>

      <footer className="text-lg text-center mt-8">
        <p>© {currentYear} PFM-2025 CodeCrypto.</p>
      </footer>
    </div>
  );
}
