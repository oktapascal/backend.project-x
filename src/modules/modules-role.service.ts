import { Inject, Injectable } from '@nestjs/common';
import { CreateModuleRoleRequest } from './request';
import { MODULES_ROLE_REPOSITORIES, ModulesRoleRepositories } from './modules-role.repositories';
import { ModulesRoleDto } from './dto';

export const MODULES_ROLE_SERVICES = 'ModulesRoleService';

export interface ModulesRoleService {
  SaveModulesRole(modules: CreateModuleRoleRequest): Promise<void>;
}

@Injectable()
export class ModulesRoleServiceImpl implements ModulesRoleService {
  constructor(@Inject(MODULES_ROLE_REPOSITORIES) private readonly repositories: ModulesRoleRepositories) {}

  SaveModulesRole(modules: CreateModuleRoleRequest): Promise<void> {
    const dto: ModulesRoleDto[] = [];

    for (let i = 0; i < modules.modules.length; i++) {
      const _dto = new ModulesRoleDto();
      _dto.module_id = modules.modules[i].module_id;
      _dto.status_active = modules.modules[i].status_active;
      _dto.role_id = modules.role_id;

      dto.push(_dto);
    }

    return this.repositories.Save(modules.role_id, dto);
  }
}
