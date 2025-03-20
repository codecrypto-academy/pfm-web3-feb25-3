import axios from 'axios';
import { Battery, BatteryStatus } from '@/app/entity/battery.entity';

const API_URL = 'http://localhost:8080/api/batteries';

interface BatteryResponse {
  message: string;
  batteries: Battery[];
}

/**
 * Obtiene todas las baterías desde la API
 */
export const fetchBatteries = async (): Promise<Battery[]> => {
  const response = await axios.get<Battery[]>(API_URL);
  return response.data;
};

/**
 * Crea una nueva batería con estado inicial MANUFACTURED
 */
export const createBattery = async (manufacturerId: string, capacity: number, location: string): Promise<Battery> => {
    const newBattery: Omit<Battery, 'id'> = {
      serialNumber: `SN-${Date.now()}`, // Serial único
      capacity,
      manufacturerId,
      currentOwnerId: manufacturerId, // Inicialmente el fabricante es el dueño
      status: BatteryStatus.MANUFACTURED,
      location,
    };
  
    const response = await axios.post<Battery>(API_URL, newBattery);
    return response.data;
  };

export const getBatteriesByRoleService = async (role: string): Promise<Battery[]> => {
  let endpoint = '';

  switch (role) {
    case 'ROLE_TRANSPORT':
      endpoint = `${API_URL}`; // Endpoint para transporte
      break;
    case 'ROLE_PRODUCER':
      endpoint = `${API_URL}/producer`;
      break;
    case 'ROLE_DISTRIBUTOR':
      endpoint = `${API_URL}/distributor`;
      break;
    case 'ROLE_OWNER':
      endpoint = `${API_URL}/owner`;
      break;
    default:
      throw new Error("Rol no reconocido");
  }

  try {
    const response = await axios.get<BatteryResponse>(endpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Asegúrate de enviar el token JWT si lo necesitas
    });

    return response.data.batteries; // Devuelve las baterías
  } catch (error) {
    console.error("Error al obtener las baterías:", error);
    throw new Error("No se pudieron obtener las baterías");
  }
};
