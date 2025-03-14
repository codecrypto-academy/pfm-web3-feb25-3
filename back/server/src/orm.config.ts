import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { SeedUsersRoles1570200490072 } from './migrations/1570200490072-SeedUsersRoles';
import { CreateTables1570200270081 } from './migrations/1570200270081-CreateTables';
import { User } from './domain/user.entity';
import { Authority } from './domain/authority.entity';
import { Shipment } from './domain/shipment.entity';
import { Battery } from './domain/battery.entity';
import { SeedBatteries1670200490073 } from './migrations/1570200509999-SeedBatteries';

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
  } else if (process.env.BACKEND_ENV === 'dev') {
    ormconfig = {
      name: 'default',
      type: 'mongodb',
      url: 'mongodb://localhost:27017/CarBatteryTraceability', 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      logging: ['query', 'error'], 
    };
  } else if (process.env.BACKEND_ENV === 'test') {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    ormconfig = {
      name: 'default',
      type: 'mongodb',
      url: uri, // En test, usa el servidor en memoria
      useNewUrlParser: true,
      useUnifiedTopology: true,
      logging: false,
    };
  } else {
    throw new Error(`BACKEND_ENV '${process.env.BACKEND_ENV}' no es válido.`);
  }

  return {
    synchronize: process.env.BACKEND_ENV === 'test' || process.env.BACKEND_ENV === 'dev'  ,
    migrationsRun: true,
    entities: [
      User,
      Authority,
      Battery,
      Shipment
    ],
    migrations: [
      CreateTables1570200270081,
      SeedUsersRoles1570200490072,
      SeedBatteries1670200490073
    ],
    autoLoadEntities: true,
    ...ormconfig,
  };
}

export { ormConfig };
