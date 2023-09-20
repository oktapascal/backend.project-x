import { Injectable, Inject } from '@nestjs/common';
import { Modules } from './entities';
import { MODULES_REPOSITORIES, ModulesRepositories } from './modules.repositories';

export const MODULES_SERVICES = 'ModulesServices';

export interface ModulesServices {
  GetModulesByUser(user_id: string): Promise<Modules[]>;
}

@Injectable()
export class ModulesServicesImpl implements ModulesServices {
  constructor(@Inject(MODULES_REPOSITORIES) private readonly modulesRepositories: ModulesRepositories) {}

  GetModulesByUser(user_id: string): Promise<Modules[]> {
    return this.modulesRepositories.GetModulesByUser(user_id);
  }
}
