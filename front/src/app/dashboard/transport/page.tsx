import Usuario from "../profile/page";

export default function Transport() {
    return (
      <div className="space-y-4">
        <Usuario />
        <h1 className="text-2xl font-white">Transportista</h1>
        <div className="bg-[var(--dashboard-card)] rounded-lg shadow p-6">
          <p>Consulta envíos del productor</p>
        </div>
      </div>
    );
  }
  