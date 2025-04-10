export interface Battery {
    id?: string;
    serialNumber: string;
    capacity: number;
    manufacturerId: string; // ID del fabricante que la creó
    currentOwnerId: string; // ID del usuario actual (distribuidor, dueño, etc.)
    status: BatteryStatus;
    location?: string; // Ubicación actual (opcional)
}

export enum BatteryStatus {
    MANUFACTURED = 'Manufactured',  // Batería fabricada
    IN_TRANSIT = 'In Transit',      // Batería en tránsito
    RECIBE_CLIENT = 'client',        // Recibido ciente
    SOLD = 'Sold',          // vendida
    STOCK = 'Stock',         // en stock
  }
  