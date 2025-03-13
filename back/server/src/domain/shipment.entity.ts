import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

/**
 * Representa un evento de transporte o cambio de dueño de una batería.
 */
@Entity('shipment')
export class Shipment {
  @ObjectIdColumn()
  _id?: ObjectId;  

  @Column()
  batteryId: string;  // ID de la batería transportada

  @Column()
  fromUserId: string;  // ID del usuario que envía la batería

  @Column()
  toUserId: string;  // ID del usuario que recibe la batería

  @Column()
  timestamp: Date;  // Fecha del movimiento

  @Column()
  location: string;  // Ubicación del evento

  @Column({ default: 'In Transit' })  
  status: string;  // Enviado, Recibido, Instalado, Reciclado
}
