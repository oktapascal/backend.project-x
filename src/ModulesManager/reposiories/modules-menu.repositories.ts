import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { ModulesMenu } from '../entities';
import { ModulesMenuCreateDto } from '../dto';

export const MODULES_MENU_REPOSITORIES = 'ModulesMenuRepositories';

export interface ModulesMenuRepositories {
  Get(module_id: string): Promise<ModulesMenu[]>;
  Save(module_id: string, menus: ModulesMenuCreateDto[]): Promise<void>;
}

@Injectable()
export class ModulesMenuRepositoriesImpl implements ModulesMenuRepositories {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  private async DeleteMenus(module_id: string, trx: EntityManager): Promise<void> {
    trx.delete(ModulesMenu, {
      module_id,
    });
  }

  private async SaveMenus(module_id: string, menus: ModulesMenuCreateDto[], trx: EntityManager): Promise<void> {
    const bulk: ModulesMenu[] = [];

    for (let i = 0; i < menus.length; i++) {
      const createModuleMenu = trx.create(ModulesMenu, {
        module_id: module_id,
        serial_number: menus[i].serial_number,
        level: menus[i].level,
        status_active: menus[i].status_active,
        menu_id: menus[i].menu_id,
      });

      bulk.push(createModuleMenu);
    }

    trx.save(bulk);
  }

  async Save(module_id: string, menus: ModulesMenuCreateDto[]): Promise<void> {
    return this.datasource.transaction(async (trx) => {
      await this.DeleteMenus(module_id, trx);
      await this.SaveMenus(module_id, menus, trx);
    });
  }

  Get(module_id: string): Promise<ModulesMenu[]> {
    return this.datasource
      .getRepository(ModulesMenu)
      .createQueryBuilder('modules_menu')
      .innerJoinAndMapOne('modules_menu.menu', 'menus', 'menu', 'modules_menu.menu_id = menu.menu_id')
      .where('modules_menu.module_id = :module_id', { module_id })
      .andWhere('modules_menu.status_active = true')
      .orderBy('modules_menu.serial_number', 'ASC')
      .getMany();
  }
}
