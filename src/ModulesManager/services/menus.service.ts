import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Menus } from '../entities';
import { CreateMenuRequest, UpdateMenuRequest } from '../request';
import { MENUS_REPOSITORIES, MenusRepositories } from '../reposiories/menus.repositories';
import { MenusDto } from '../dto/menus.dto';

export const MENUS_SERVICES = 'MenusServices';

export interface MenusServices {
  GetAllMenus(): Promise<Menus[]>;
  GetOneMenu(menu_id: string): Promise<Menus>;
  SaveMenu(menu: CreateMenuRequest): Promise<Menus>;
  UpdateMenu(menu: UpdateMenuRequest): Promise<Menus>;
  DeleteMenu(menu_id: string): Promise<void>;
}

@Injectable()
export class MenusServicesImpl implements MenusServices {
  constructor(@Inject(MENUS_REPOSITORIES) private readonly menusRepositories: MenusRepositories) {}

  private async NewMenuId(): Promise<string> {
    const result = await this.GenerateMenuId();

    if (!result) return 'MEN.0001';

    const temp = result.menu_id.split('.');

    const prefix = temp[0];
    const newNumber = parseInt(temp[1]) + 1;

    const length = newNumber.toString().length;

    if (length === 1) return `${prefix}.000${newNumber}`;
    if (length === 2) return `${prefix}.00${newNumber}`;
    if (length === 3) return `${prefix}.0${newNumber}`;
    if (length === 4) return `${prefix}.${newNumber}`;
  }

  private GenerateMenuId(): Promise<Menus> {
    return this.menusRepositories.GetLastMenuId();
  }

  GetAllMenus(): Promise<Menus[]> {
    return this.menusRepositories.GetAllMenus();
  }

  GetOneMenu(menu_id: string): Promise<Menus> {
    return this.menusRepositories.GetOneMenu(menu_id);
  }

  async SaveMenu(menu: CreateMenuRequest): Promise<Menus> {
    const id = await this.NewMenuId();

    const dto = new MenusDto();
    dto.menu_id = id;
    dto.name = menu.name;
    dto.menu_icon = menu.icon;
    dto.path_url = menu.path_url;
    

    return this.menusRepositories.CreateMenu(dto);
  }

  async UpdateMenu(menu: UpdateMenuRequest): Promise<Menus> {
    const _menu = await this.menusRepositories.GetOneMenu(menu.menu_id);

    if (!_menu) throw new NotFoundException([{ field: 'menu_id', error: 'id menu tidak ditemukan' }]);

    const dto = new MenusDto();
    dto.menu_id = menu.menu_id;
    dto.name = menu.name;
    dto.menu_icon = menu.icon;
    dto.path_url = menu.path_url;

    return this.menusRepositories.UpdateMenu(dto);
  }

  async DeleteMenu(menu_id: string): Promise<void> {
    const _menu = await this.menusRepositories.GetOneMenu(menu_id);

    if (!_menu) throw new NotFoundException([{ error: 'id menu tidak ditemukan' }]);

    this.menusRepositories.DeleteMenu(menu_id);
  }
}
