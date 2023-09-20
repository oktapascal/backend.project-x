import { Injectable } from '@nestjs/common';
import { Modules } from './entities';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ModulesUser } from './entities/modules-user.entity';

export const MODULES_REPOSITORIES = 'ModulesRepositories';

export interface ModulesRepositories {
  GetModulesByUser(user_id: string): Promise<Modules[]>;
}

@Injectable()
export class ModulesRepositoriesImpl implements ModulesRepositories {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  GetModulesByUser(user_id: string): Promise<Modules[]> {
    return this.datasource
      .getRepository(Modules)
      .createQueryBuilder('modules')
      .innerJoin(ModulesUser, 'modules_user', 'modules.id = modules_user.module_id')
      .where('modules_user.user_id = :user_id', { user_id })
      .andWhere('modules.status_active = true')
      .andWhere('modules_user.status_active = true')
      .orderBy('modules.id', 'ASC')
      .getMany();
  }
}
