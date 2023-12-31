import { Inject, Injectable } from '@nestjs/common';
import { MODULES_MENU_REPOSITORIES, ModulesMenuRepositories } from '../reposiories/modules-menu.repositories';
import { CreateModuleMenuRequest } from '../request/create-module-menu.request';
import { ModulesMenuCreateDto, ModulesMenuDto } from '../dto';

export const MODULES_MENU_SERVICES = 'ModulesMenuServices';

export interface ModulesMenuServices {
  GetModuleMenus(module_id: string): Promise<ModulesMenuDto[]>;
  SaveModulesMenu(menus: CreateModuleMenuRequest): Promise<void>;
}

@Injectable()
export class ModulesMenuServicesImpl implements ModulesMenuServices {
  constructor(@Inject(MODULES_MENU_REPOSITORIES) private readonly repositories: ModulesMenuRepositories) {}

  async SaveModulesMenu(menus: CreateModuleMenuRequest): Promise<void> {
    let serial_number = 0;

    const dto = menus.menus
      .map((menu) => {
        const _dto = new ModulesMenuCreateDto();
        _dto.module_id = menus.module_id;
        _dto.level = 0;
        _dto.menu_id = menu.menu_id;
        _dto.status_active = menu.status_active;
        _dto.serial_number = serial_number;
        serial_number++;

        const childrenDto = (menu.children || []).map((child) => {
          const _childDto = new ModulesMenuCreateDto();
          _childDto.module_id = menus.module_id;
          _childDto.level = 1;
          _childDto.menu_id = child.menu_id;
          _childDto.status_active = child.status_active;
          _childDto.serial_number = serial_number;
          serial_number++;

          return _childDto;
        });

        return [_dto, ...childrenDto];
      })
      .flat();

    this.repositories.Save(menus.module_id, dto);
  }

  async GetModuleMenus(module_id: string): Promise<ModulesMenuDto[]> {
    const result = await this.repositories.Get(module_id);

    const menus: ModulesMenuDto[] = result.reduce((value, currentItem) => {
      if (currentItem.level === 0) {
        const parent: ModulesMenuDto = {
          serial_number: currentItem.serial_number,
          name: currentItem.menu.name,
          path_url: currentItem.menu.path_url,
          menu_icon: currentItem.menu.menu_icon,
          children: [],
        };
        value.push(parent);
      } else {
        const indexParent = value.length - 1;
        const children = {
          serial_number: currentItem.serial_number,
          name: currentItem.menu.name,
          path_url: currentItem.menu.path_url,
          menu_icon: currentItem.menu.menu_icon,
        };
        value[indexParent].children.push(children);
      }

      return value;
    }, [] as ModulesMenuDto[]);

    return menus;
  }
}
