export interface IBattery {
  id: string;                // ID único de la batería
  serialNumber: string;      // Productor
  capacity: string;          // Capacidad en kWh
  manufacturerId: string;  // ID del fabricante que la creó
  currentOwnerId: string;  // ID del usuario actual (distribuidor, dueño, etc.)
  status: BatteryStatus;  // Estado: Manufactured, In Transit, Installed, Recycled
  location: string;  // Ubicación actual (opcional)
}


export enum BatteryStatus {
  MANUFACTURED = 'Manufactured',  // Batería fabricada
  IN_TRANSIT = 'In Transit',      // Batería en tránsito 
  RECEIVED = 'Received',        // Batería en Distribuidor - Stock
  SOLD = 'Sold',          // Batería vendida
}