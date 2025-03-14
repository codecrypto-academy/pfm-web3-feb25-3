export interface Shipment {
    id?: string; // ID del envío
    batteryId: string; // ID de la batería transportada
    fromUserId: string; // ID del usuario que envía la batería
    toUserId: string; // ID del usuario que recibe la batería
    timestamp: Date; // Fecha del movimiento
    location: string; // Ubicación del evento
    status: string; // Enviado, Recibido, Instalado, Reciclado
}

export enum ShipmentStatus {
    SENT = 'Sent',
    RECEIVED = 'Received',
    INSTALLED = 'Installed',
    RECYCLED = 'Recycled',
  }

