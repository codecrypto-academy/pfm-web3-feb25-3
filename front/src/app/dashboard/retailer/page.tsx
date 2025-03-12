import Usuario from "../profile/page";

export default function Retailer() {
    return (
      <div className="space-y-4">
        <Usuario />
        <h1 className="text-2xl font-bold">Minorísta</h1>
        <div className="bg-[var(--dashboard-card)] rounded-lg shadow p-6">
          <p>Consulta minorista</p>
        </div>
      </div>
    );
  }
  