export interface Battery {
  id: string;                // ID único de la batería
  manufacturer: string;      // Productor
  capacity: string;          // Capacidad en kWh
  status: BatteryStatus;            // Estado ("produced", "installed", "in_use", "recycled")
  owner: string;             // Propietario actual (Ethereum Address)
  health: number;            // Estado de salud (SOH)
  timestamp: string;         // Fecha de creación
  recycled: boolean;         // ¿Ha sido reciclada?
}


export enum BatteryStatus {
  MANUFACTURED = 'Manufactured',  // Batería fabricada
  IN_TRANSIT = 'In Transit',      // Batería en tránsito
  INSTALLED = 'Installed',        // Batería instalada en un vehículo
  RECYCLED = 'Recycled',          // Batería reciclada
}
