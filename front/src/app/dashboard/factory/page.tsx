'use client';

import { useState, useEffect } from "react";
import { Battery, BatteryStatus } from "@/app/entity/battery.entity";
import { fetchBatteries, createBattery } from "@/app/services/batteryService";
import { User } from "@/app/entity/user.entity";
import { useAuth } from "@/app/hooks/useAuth";

export default function Factory() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  // Datos del formulario de la batería
  const [capacity, setCapacity] = useState(100);
  const [location, setLocation] = useState("Fábrica");

  useEffect(() => {
    loadBatteries();
  }, []);

  const loadBatteries = async () => {
    setLoading(true);
    try {
      const data = await fetchBatteries();
      setBatteries(data);
    } catch (error) {
      setError("Error al cargar las baterías");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBattery = async () => {
    try {
      if (!user?.ethereumAddress) {
        setError("No se puede crear la batería: Dirección Ethereum no disponible");
        return;
      }
      const newBattery = await createBattery(user.ethereumAddress, capacity, location);
      setBatteries([...batteries, newBattery]);
      setIsModalOpen(false); // Cerrar modal después de agregar
    } catch (error) {
      setError("Error al agregar la batería");
    }
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status: BatteryStatus) => {
    switch (status) {
      case BatteryStatus.MANUFACTURED:
        return 'bg-gray-600'; // Gris para fabricadas
      case BatteryStatus.IN_TRANSIT:
        return 'bg-blue-600'; // Azul para en tránsito
      case BatteryStatus.RECEIVED:
        return 'bg-green-600'; // Verde para recibidas
      case BatteryStatus.SOLD:
        return 'bg-red-600'; // Rojo para vendidas
      default:
        return 'bg-gray-800'; // Por defecto gris oscuro
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Lista de Baterías</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Agregar Batería
      </button>

      {loading && <p className="mt-4">Cargando...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Mostrar las baterías */}
      <ul className="mt-4 space-y-3">
        {batteries.map((battery) => (
          <li key={battery.id} className="p-4 bg-gray-800 rounded-lg flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <strong>Serial:</strong> <span>{battery.serialNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <strong>Capacidad:</strong> <span>{battery.capacity} Ah</span>
              </div>
              <div className="flex items-center gap-2">
                <strong>Ubicación:</strong> <span>{battery.location || "Desconocida"}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Estado de la batería */}
              <div className={`py-1 px-3 text-white rounded-lg ${getStatusColor(battery.status)}`}>
                {battery.status}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal para agregar una batería */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Nueva Batería</h3>

            <label className="block mb-2">
              Capacidad (Ah):
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
              />
            </label>

            <label className="block mb-2">
              Ubicación:
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
              />
            </label>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded mr-2 hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateBattery}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
