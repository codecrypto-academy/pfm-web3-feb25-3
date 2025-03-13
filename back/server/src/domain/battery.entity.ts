import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';
import { BatteryStatus } from './enum/battery-status.enum'; // Asegúrate de importar el enum correctamente

/**
 * Representa una batería en la trazabilidad.
 */
@Entity('battery')
export class Battery {
  @ObjectIdColumn()
  _id?: ObjectId;  

  @Column()
  serialNumber: string;  // Número de serie único

  @Column()
  capacity: number;  // Capacidad en kWh

  @Column()
  manufacturerId: string;  // ID del fabricante que la creó

  @Column()
  currentOwnerId: string;  // ID del usuario actual (distribuidor, dueño, etc.)

  @Column({ type: 'enum', enum: BatteryStatus, default: BatteryStatus.MANUFACTURED })  
  status: BatteryStatus;  // Estado: Manufactured, In Transit, Installed, Recycled

  @Column({ nullable: true })
  location: string;  // Ubicación actual (opcional)
}
