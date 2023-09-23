import { Inject, Injectable } from '@nestjs/common';
import { Roles } from './entities';
import { CreateRoleRequest, UpdateRoleRequest } from './requests';
import { ROLES_REPOSITORIES, RolesRepositoriesImpl } from './roles.repositories';
import { RolesDto } from './dto';

export const ROLES_SERVICES = 'RolesServices';

interface RolesServices {
  GetAll(): Promise<Roles[]>;
  GetOne(role_id: string): Promise<Roles>;
  Save(role: CreateRoleRequest): Promise<Roles>;
  Update(role_id: string, role: UpdateRoleRequest): Promise<Roles>;
  Delete(role_id: string): Promise<void>;
}

@Injectable()
export class RolesServiceImpl implements RolesServices {
  constructor(@Inject(ROLES_REPOSITORIES) private readonly roleRepositories: RolesRepositoriesImpl) {}

  private async NewRoleId(): Promise<string> {
    const result = await this.GenerateRoleId();

    if (!result) return 'ROL.001';

    const temp = result.role_id.split('.');

    const prefix = temp[0];
    const newNumber = parseInt(temp[1]) + 1;

    const length = newNumber.toString().length;

    if (length === 1) return `${prefix}.00${newNumber}`;
    if (length === 2) return `${prefix}.0${newNumber}`;
    if (length === 3) return `${prefix}.${newNumber}`;
  }

  private GenerateRoleId(): Promise<Roles> {
    return this.roleRepositories.GetLastId();
  }

  GetAll(): Promise<Roles[]> {
    return this.roleRepositories.GetAll();
  }

  GetOne(role_id: string): Promise<Roles> {
    return this.roleRepositories.GetOne(role_id);
  }

  async Save(role: CreateRoleRequest): Promise<Roles> {
    const id = await this.NewRoleId();

    const dto = new RolesDto();
    dto.role_id = id;
    dto.name = role.name;
    dto.flag_read = role.flag_read;
    dto.flag_insert = role.flag_insert;
    dto.flag_update = role.flag_update;
    dto.flag_delete = role.flag_delete;
    dto.status_active = true;

    return this.roleRepositories.Save(dto);
  }

  Update(role_id: string, role: UpdateRoleRequest): Promise<Roles> {
    const dto = new RolesDto();
    dto.name = role.name;
    dto.flag_read = role.flag_read;
    dto.flag_insert = role.flag_insert;
    dto.flag_update = role.flag_update;
    dto.flag_delete = role.flag_delete;

    return this.roleRepositories.Update(role_id, dto);
  }

  Delete(role_id: string): Promise<void> {
    return this.roleRepositories.Delete(role_id);
  }
}
