import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MenusDto } from '../dto/menus.dto';
import { Menus } from '../entities';

export const MENUS_REPOSITORIES = 'MenusRepositories';

export interface MenusRepositories {
  CreateMenu(menu: MenusDto): Promise<Menus>;
  GetAllMenus(): Promise<Menus[]>;
  GetOneMenu(menu_id: string): Promise<Menus>;
  GetLastMenuId(): Promise<Menus>;
  UpdateMenu(menu: MenusDto): Promise<Menus>;
  DeleteMenu(menu_id: string): Promise<void>;
}

@Injectable()
export class MenusRepositoriesImpl implements MenusRepositories {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  async CreateMenu(menu: MenusDto): Promise<Menus> {
    await this.datasource.createQueryBuilder().insert().into(Menus).values({ menu_id: menu.menu_id, name: menu.name, menu_icon: menu.menu_icon, path_url: menu.path_url }).execute();

    return this.GetOneMenu(menu.menu_id);
  }

  GetAllMenus(): Promise<Menus[]> {
    return this.datasource.getRepository(Menus).createQueryBuilder().orderBy('id', 'ASC').getMany();
  }

  GetOneMenu(menu_id: string): Promise<Menus> {
    return this.datasource.getRepository(Menus).createQueryBuilder().where('menu_id = :menu_id', { menu_id }).getOne();
  }

  GetLastMenuId(): Promise<Menus> {
    return this.datasource.getRepository(Menus).createQueryBuilder().orderBy('id', 'DESC').getOne();
  }

  async UpdateMenu(menu: MenusDto): Promise<Menus> {
    await this.datasource
      .createQueryBuilder()
      .update(Menus)
      .set({ name: menu.name, menu_icon: menu.menu_icon, path_url: menu.path_url })
      .where('menu_id = :menu_id', { menu_id: menu.menu_id })
      .execute();

    return this.GetOneMenu(menu.menu_id);
  }

  async DeleteMenu(menu_id: string): Promise<void> {
    this.datasource.createQueryBuilder().delete().from(Menus).where('menu_id = :menu_id', { menu_id }).execute();
  }
}
