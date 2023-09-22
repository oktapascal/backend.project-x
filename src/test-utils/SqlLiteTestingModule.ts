import { AuthSession, User, UserProfile } from '../users/entities';
import { DataSource } from 'typeorm';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Modules, ModulesMenu, ModulesUser } from '../modules/entities';

export const SqlLiteDatasource: TypeOrmModuleAsyncOptions = {
  useFactory: (): TypeOrmModuleOptions => ({
    type: 'better-sqlite3',
    database: 'db.sqlite',
    dropSchema: true,
    entities: [User, UserProfile, AuthSession, Modules, ModulesUser, ModulesMenu],
    synchronize: true,
  }),
  dataSourceFactory: async (options) => {
    return await new DataSource(options).initialize();
  },
};
