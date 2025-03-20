import { Object, Property } from 'fabric-contract-api';

@Object()
export class Battery {
  @Property()
  public docType?: string = 'battery';

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
  public status: BatteryStatus = BatteryStatus.MANUFACTURED;  // Estado actual de la batería

  @Property()
  public location: string = '';  // Ubicación actual
 
  @Property()
  public history: string = '';
}

// 📍 ENUM de estados de batería
export enum BatteryStatus {
  MANUFACTURED = 'Manufactured',  
  IN_TRANSIT = 'In Transit',      
  RECEIVED = 'Received',          
  SOLD = 'Sold',                  
}

// 📍 Modelo para historial de transacciones
@Object()
export class BatteryTransaction {
  @Property()
  public idBattery: string = '';

  @Property()
  public timestamp: string = '';

  @Property()
  public action: string = '';

  @Property()
  public from: string = '';  // ID del usuario anterior

  @Property()
  public to: string = '';  // ID del nuevo propietario

  @Property()
  public transactionId: string = ''; // ID de la transacción en Fabric

  @Property()
  public timestampBlockchain: string = ''; // Timestamp de la transacción en Fabric
}