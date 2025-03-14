import { Entity, ObjectIdColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { ObjectId } from 'mongodb';
import { UserType } from './enum/user-type.enum';
import { Authority } from './authority.entity';

@Entity('jhi_user')
export class User {
  @ObjectIdColumn()
  _id?: ObjectId; // ID único en MongoDB

  @Column() // ✅ Esto ya crea el índice automáticamente, no necesitas @Index
  ethereumAddress: string; // Dirección Ethereum del usuario (única)

  @Column()
  roles: Authority[]; // Roles del usuario

  @Column({ type: 'enum', enum: UserType })
  type?: UserType; // Tipo de usuario (Producer, Manufacturer, Distributor, etc.)

  @Column({ nullable: true })
  firstName?: string; // Nombre del usuario (opcional)

  @Column({ nullable: true })
  lastName?: string; // Apellido del usuario (opcional)

  @Column({ nullable: true })
  companyName?: string; // Nombre de la empresa si aplica (opcional)
}
