import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';

@Entity('jhi_user')
export class User {
  @ObjectIdColumn()
  _id?: ObjectId;  

  @Column({ unique: true })
  ethereumAddress: string;

  @Column()
  roles?: string[];
}
