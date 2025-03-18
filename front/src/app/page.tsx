'use client';

import Register from '@/components/Register';
import ConnectWallet from '../components/ConnectWallet';
import BatteryHistory from '@/components/BatteryHistory';

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
      <main className="flex flex-row gap-8 row-start-2 items-start justify-center w-full">
        
          <div className="flex flex-col w-full">
            <div className="w-full text-center mb-8">
              <h2 className="text-3xl font-bold text-left sm:text-left">
                Trazabilidad de baterías de vehículos eléctricos
              </h2>
            </div>
          
            <div className="flex flex-col md:flex-row w-full gap-6">
              <div className="flex-1 md:max-w-[50%]">
                <Register />
              </div>

              <div className="flex-1 md:max-w-[50%]">
                <BatteryHistory />
              </div>
            </div>

          </div>
      </main>
      <div>
        <footer className="row-start-3 text-2xl font-bold text-center sm:text-left" >
          <p>© {currentYear} PFM-2025 CodeCrypto.</p>
        </footer>
      </div>
    </div>
  );
}