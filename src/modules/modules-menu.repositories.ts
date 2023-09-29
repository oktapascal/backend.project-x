import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { ModulesMenu } from './entities';
import { ModulesMenuDto } from './dto';

export const MODULES_MENU_REPOSITORIES = 'ModulesMenuRepositories';

export interface ModulesMenuRepositories {
  Get(module_id: string): Promise<ModulesMenu[]>;
  Save(module_id: string, menus: ModulesMenuDto[]): Promise<void>;
}

@Injectable()
export class ModulesMenuRepositoriesImpl implements ModulesMenuRepositories {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  private async DeleteMenus(module_id: string, trx: EntityManager): Promise<void> {
    trx.delete(ModulesMenu, {
      module_id,
    });
  }

  private async SaveMenus(module_id: string, menus: ModulesMenuDto[], trx: EntityManager): Promise<void> {
    const bulk: ModulesMenu[] = [];

    for (let i = 0; i < menus.length; i++) {
      const createModuleMenu = trx.create(ModulesMenu, {
        module_id: module_id,
        serial_number: menus[i].serial_number,
        name: menus[i].name,
        level: menus[i].level,
        path_url: menus[i].path_url,
        status_active: menus[i].status_active,
      });

      bulk.push(createModuleMenu);
    }

    trx.save(bulk);
  }

  async Save(module_id: string, menus: ModulesMenuDto[]): Promise<void> {
    return this.datasource.transaction(async (trx) => {
      await this.DeleteMenus(module_id, trx);
      await this.SaveMenus(module_id, menus, trx);
    });
  }

  Get(module_id: string): Promise<ModulesMenu[]> {
    return this.datasource.getRepository(ModulesMenu).createQueryBuilder().where('module_id = :module_id', { module_id }).andWhere('status_active = true').orderBy('serial_number', 'ASC').getMany();
  }
}
