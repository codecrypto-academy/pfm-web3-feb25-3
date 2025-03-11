//import Image from "next/image";
export default function Home() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          Proyecto de Fin de Máster
        </h1>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h2 className="text-2xl font-bold text-center sm:text-left">
          Trazabilidad de baterías de vehículos eléctricos
        </h2>
      <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/dashboard"
          aria-label="Acceder al panel de control através de Metamask"
        >
          Conexión 
        </a>
      </main>
      <div>
        <footer className="row-start-3 text-2xl font-bold text-center sm:text-left" >
          <p>© {currentYear} PFM-2025 CodeCrypto.</p>
        </footer>
      </div>
    </div>
  );
}