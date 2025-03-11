import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { SeedUsersRoles1570200490072 } from './migrations/1570200490072-SeedUsersRoles';
import { CreateTables1570200270081 } from './migrations/1570200270081-CreateTables';
import { User } from './domain/user.entity';
import { Authority } from './domain/authority.entity';

async function ormConfig(): Promise<TypeOrmModuleOptions> {
  let mongod: MongoMemoryServer | null = null;
  let ormconfig: TypeOrmModuleOptions;

  if (process.env.BACKEND_ENV === 'prod') {
    ormconfig = {
      name: 'default',
      type: 'mongodb',
      url: 'mongodb://mongodb:27017/CarBatteryTraceability',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      logging: false,
    };
  } else if (process.env.BACKEND_ENV === 'test' || process.env.BACKEND_ENV === 'dev') {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    ormconfig = {
      name: 'default',
      type: 'mongodb',
      url: uri, // En lugar de host/port, usa el URI del servidor en memoria
      useNewUrlParser: true,
      useUnifiedTopology: true,
      logging: true,
    };
  } else {
    throw new Error(`BACKEND_ENV '${process.env.BACKEND_ENV}' no es válido.`);
  }

  return {
    synchronize: process.env.BACKEND_ENV === 'test',
    migrationsRun: true,
    entities: [
      User,
      Authority,
    ],
    migrations: [
      CreateTables1570200270081,
      SeedUsersRoles1570200490072,
    ],
    autoLoadEntities: true,
    ...ormconfig,
  };
}

export { ormConfig };
