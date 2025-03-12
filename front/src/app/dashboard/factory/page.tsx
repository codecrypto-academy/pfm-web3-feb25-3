import Usuario from "../profile/page";

export default function Factory() {
    return (
      <div className="space-y-4">
        <Usuario />
        <h1 className="text-2xl font-white">Fábrica</h1>
        <div className="bg-[var(--dashboard-card)] rounded-lg shadow p-6">
          <p>Consulta los envíos de fábrica</p>
        </div>
      </div>
    );
  }
  