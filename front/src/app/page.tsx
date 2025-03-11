'use client';

import ConnectWallet from '../components/ConnectWallet';

export default function Home() {
  const currentYear = new Date().getFullYear();
return (
    <div className="relative grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ConnectWallet />
      
      <header className="row-start-1">
        <h1 className="text-3xl font-bold text-left sm:text-left">
          Proyecto de Fin de Máster
        </h1>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h2 className="text-2xl font-bold text-center sm:text-left">
          Trazabilidad de baterías de vehículos eléctricos
        </h2>
        
      </main>
      <div>
        <footer className="row-start-3 text-2xl font-bold text-center sm:text-left" >
          <p>© {currentYear} PFM-2025 CodeCrypto.</p>
        </footer>
      </div>
    </div>
  );
}