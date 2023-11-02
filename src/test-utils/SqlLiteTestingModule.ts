import { AuthSession, Roles, User, UserProfile } from '../UsersManager/entities';
import { DataSource } from 'typeorm';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Modules, ModulesMenu, ModulesRole, Menus } from '../ModulesManager/entities';

export const SqlLiteDatasource: TypeOrmModuleAsyncOptions = {
  useFactory: (): TypeOrmModuleOptions => ({
    type: 'better-sqlite3',
    database: 'db.sqlite',
    dropSchema: true,
    entities: [User, UserProfile, AuthSession, Modules, ModulesRole, ModulesMenu, Roles, Menus],
    synchronize: true,
  }),
  dataSourceFactory: async (options) => {
    return await new DataSource(options).initialize();
  },
};
