import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('jhi_user')
export class User {
  @ObjectIdColumn({ name: '_id' })
  id?: string;

  @Column({ unique: true })
  ethereumAddress: string; // Identificador único (Dirección Ethereum)

  @Column()
  roles: string[];
}
