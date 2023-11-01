import { Injectable } from '@nestjs/common';
import { ModulesRoleDto } from '../dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { ModulesRole } from '../entities';

export const MODULES_ROLE_REPOSITORIES = 'ModulesRoleRepositories';

export interface ModulesRoleRepositories {
  Save(role_id: string, modules: ModulesRoleDto[]): Promise<void>;
}

@Injectable()
export class ModulesRoleRepositoriesImpl implements ModulesRoleRepositories {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  private async DeleteModulesRole(role_id: string, trx: EntityManager): Promise<void> {
    trx.delete(ModulesRole, {
      role_id,
    });
  }

  private async SaveModulesRole(role_id: string, modules: ModulesRoleDto[], trx: EntityManager): Promise<void> {
    const bulk: ModulesRole[] = [];

    for (let i = 0; i < modules.length; i++) {
      const createModuleRole = trx.create(ModulesRole, {
        module_id: modules[i].module_id,
        role_id: role_id,
        status_active: modules[i].status_active,
      });

      bulk.push(createModuleRole);
    }

    trx.save(bulk);
  }

  async Save(role_id: string, modules: ModulesRoleDto[]): Promise<void> {
    return this.datasource.transaction(async (trx) => {
      await this.DeleteModulesRole(role_id, trx);
      await this.SaveModulesRole(role_id, modules, trx);
    });
  }
}
