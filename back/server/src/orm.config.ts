import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { SeedUsersRoles1570200490072 } from './migrations/1570200490072-SeedUsersRoles';
import { CreateTables1570200270081 } from './migrations/1570200270081-CreateTables';
import { User } from './domain/user.entity';
import { Authority } from './domain/authority.entity';
// jhipster-needle-add-entity-to-ormconfig-imports - JHipster will add code here, do not remove

async function ormConfig(): Promise<TypeOrmModuleOptions> {
  let mongod;
  if (process.env.BACKEND_ENV !== 'prod') {
    mongod = await MongoMemoryServer.create();
  }
  let ormconfig: TypeOrmModuleOptions;

  if (process.env.BACKEND_ENV === 'prod') {
    ormconfig = {
      name: 'default',
      type: 'mongodb',
      // typeorm fails to auto load driver due to workspaces resolution
      driver: require('mongodb'),
      database: 'CarBatteryTraceability',
      host: 'mongodb',
      // port: ,
      username: '',
      password: '',
      logging: false,
      // synchronize: false,
    };
  } else if (process.env.BACKEND_ENV === 'test') {
    ormconfig = {
      name: 'default',
      type: 'mongodb',
      // typeorm fails to auto load driver due to workspaces resolution
      driver: require('mongodb'),
      host: '127.0.0.1',
      port: mongod.instanceInfo.port,
      database: mongod.instanceInfo.dbName,
      logging: true,
    };
  } else if (process.env.BACKEND_ENV === 'dev') {
    ormconfig = {
      name: 'default',
      type: 'mongodb',
      // typeorm fails to auto load driver due to workspaces resolution
      driver: require('mongodb-memory-server'),
      database: 'CarBatteryTraceability',
      host: '127.0.0.1',
      // port: ,
      username: '',
      password: '',
      logging: false,
    };
  } else {
    ormconfig = {
      name: 'default',
      type: 'mongodb',
      // typeorm fails to auto load driver due to workspaces resolution
      driver: require('mongodb-memory-server'),
      host: '127.0.0.1',
      port: mongod?.instanceInfo?.port ?? 0,
      database: mongod?.instanceInfo?.dbName ?? 'dev',
      logging: true,
    };
  }

  return {
    synchronize: process.env.BACKEND_ENV === 'test',
    migrationsRun: true,
    entities: [
      User,
      Authority,
      // jhipster-needle-add-entity-to-ormconfig-entities - JHipster will add code here, do not remove
    ],
    migrations: [
      CreateTables1570200270081,
      SeedUsersRoles1570200490072,
      // jhipster-needle-add-migration-to-ormconfig-migrations - JHipster will add code here, do not remove
    ],
    autoLoadEntities: true,
    ...ormconfig,
  };
}

export { ormConfig };
