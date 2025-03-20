import { Object, Property } from 'fabric-contract-api';

@Object()
export class Battery {
  @Property()
  public docType?: string;

  @Property()
  public id: string = '';  // ID único de la batería

  @Property()
  public serialNumber: string = '';  // Número de serie de la batería

  @Property()
  public capacity: string = '';  // Capacidad en kWh

  @Property()
  public manufacturerId: string = '';  // ID del fabricante

  @Property()
  public currentOwnerId: string = '';  // ID del propietario actual

  @Property()
  public status: string = '';  // Estado de la batería

  @Property()
  public location: string = '';  // Ubicación actual
}


export enum BatteryStatus {
  MANUFACTURED = 'Manufactured',  // Batería fabricada
  IN_TRANSIT = 'In Transit',      // Batería en tránsito 
  RECEIVED = 'Received',        // Batería en Distribuidor - Stock
  SOLD = 'Sold',          // Batería vendida
}
