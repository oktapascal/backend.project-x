import { Injectable } from '@nestjs/common';
import { Modules } from './entities';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ModulesUser } from './entities/modules-user.entity';
import { ModulesDto } from './dto';

export const MODULES_REPOSITORIES = 'ModulesRepositories';

export interface ModulesRepositories {
  CreateModule(module: ModulesDto): Promise<Modules>;
  GetModulesByUser(user_id: string): Promise<Modules[]>;
  GetAllModules(): Promise<Modules[]>;
  GetOneModule(module_id: string): Promise<Modules>;
  GetLastModuleId(): Promise<Modules>;
  UpdateModule(module: ModulesDto): Promise<Modules>;
  DeleteModule(module_id: string): Promise<void>;
}

@Injectable()
export class ModulesRepositoriesImpl implements ModulesRepositories {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  async UpdateModule(module: ModulesDto): Promise<Modules> {
    await this.datasource.createQueryBuilder().update(Modules).set({ name: module.name, module_icon: module.module_icon }).where('module_id = :module_id', { module_id: module.module_id }).execute();

    return this.datasource.getRepository(Modules).createQueryBuilder().where('module_id = :module_id', { module_id: module.module_id }).getOne();
  }

  async CreateModule(module: ModulesDto): Promise<Modules> {
    await this.datasource
      .createQueryBuilder()
      .insert()
      .into(Modules)
      .values({
        module_id: module.module_id,
        name: module.name,
        module_icon: module.module_icon,
        status_active: true,
      })
      .execute();

    return this.datasource.getRepository(Modules).createQueryBuilder().where('module_id = :module_id', { module_id: module.module_id }).getOne();
  }

  GetLastModuleId(): Promise<Modules> {
    return this.datasource.getRepository(Modules).createQueryBuilder().orderBy('id', 'DESC').getOne();
  }

  GetOneModule(module_id: string): Promise<Modules> {
    return this.datasource.getRepository(Modules).createQueryBuilder().where('module_id = :module_id', { module_id }).getOne();
  }

  GetAllModules(): Promise<Modules[]> {
    return this.datasource.getRepository(Modules).createQueryBuilder().where('status_active = true').orderBy('id', 'ASC').getMany();
  }

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

  async DeleteModule(module_id: string): Promise<void> {
    this.datasource.createQueryBuilder().update(Modules).set({ status_active: false }).where('module_id = :module_id', { module_id }).execute();
  }
}
