import axios from 'axios';
import { Battery, BatteryStatus } from '@/app/entity/battery.entity';

const API_URL = 'http://localhost:8080/api/batteries';

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
