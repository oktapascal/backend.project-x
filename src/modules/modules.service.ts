import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Modules } from './entities';
import { MODULES_REPOSITORIES, ModulesRepositories } from './modules.repositories';
import { CreateModuleRequest, UpdateModuleRequest } from './request';
import { ModulesDto } from './dto';

export const MODULES_SERVICES = 'ModulesServices';

export interface ModulesServices {
  GetModulesByUser(user_id: string): Promise<Modules[]>;
  SaveModule(module: CreateModuleRequest): Promise<Modules>;
  UpdateModule(module: UpdateModuleRequest): Promise<Modules>;
  DeleteModule(module_id: string): Promise<void>;
}

@Injectable()
export class ModulesServicesImpl implements ModulesServices {
  constructor(@Inject(MODULES_REPOSITORIES) private readonly modulesRepositories: ModulesRepositories) {}

  private async NewModuleId(): Promise<string> {
    const result = await this.GenerateModuleId();

    if (!result) return 'MDL.001';

    const temp = result.module_id.split('.');

    const prefix = temp[0];
    const newNumber = parseInt(temp[1]) + 1;

    const length = newNumber.toString().length;

    if (length === 1) return `${prefix}.00${newNumber}`;
    if (length === 2) return `${prefix}.0${newNumber}`;
    if (length === 3) return `${prefix}.${newNumber}`;
  }

  private GenerateModuleId(): Promise<Modules> {
    return this.modulesRepositories.GetLastModuleId();
  }

  GetModulesByUser(user_id: string): Promise<Modules[]> {
    return this.modulesRepositories.GetModulesByUser(user_id);
  }

  async SaveModule(module: CreateModuleRequest): Promise<Modules> {
    const id = await this.NewModuleId();

    const dto = new ModulesDto();
    dto.module_id = id;
    dto.name = module.name;
    dto.module_icon = module.icon;
    dto.default_view = module.default_view;

    return this.modulesRepositories.CreateModule(dto);
  }

  async UpdateModule(module: UpdateModuleRequest): Promise<Modules> {
    const _module = await this.modulesRepositories.GetOneModule(module.id);

    if (!_module) throw new NotFoundException([{ field: 'id', error: 'id modul tidak ditemukan' }]);

    const dto = new ModulesDto();
    dto.module_id = module.id;
    dto.name = module.name;
    dto.module_icon = module.icon;
    dto.default_view = module.default_view;

    return this.modulesRepositories.UpdateModule(dto);
  }

  async DeleteModule(module_id: string): Promise<void> {
    const _module = await this.modulesRepositories.GetOneModule(module_id);

    if (!_module) throw new NotFoundException([{ error: 'id modul tidak ditemukan' }]);

    this.modulesRepositories.DeleteModule(module_id);
  }
}
