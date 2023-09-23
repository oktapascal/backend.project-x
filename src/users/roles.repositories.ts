import { InjectDataSource } from '@nestjs/typeorm';
import { RolesDto } from './dto';
import { Roles } from './entities';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

export const ROLES_REPOSITORIES = 'RolesRepositories';

export interface RolesRepositories {
  GetAll(): Promise<Roles[]>;
  GetOne(role_id: string): Promise<Roles>;
  GetLastId(): Promise<Roles>;
  Save(role: RolesDto): Promise<Roles>;
  Update(role_id: string, role: RolesDto): Promise<Roles>;
  Delete(role_id: string): Promise<void>;
}

@Injectable()
export class RolesRepositoriesImpl implements RolesRepositories {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  GetAll(): Promise<Roles[]> {
    return this.datasource.getRepository(Roles).createQueryBuilder().where('status_active = true').orderBy('id', 'ASC').getMany();
  }

  GetOne(role_id: string): Promise<Roles> {
    return this.datasource.getRepository(Roles).createQueryBuilder().where('role_id = :role_id', { role_id }).getOne();
  }

  GetLastId(): Promise<Roles> {
    return this.datasource.getRepository(Roles).createQueryBuilder().orderBy('id', 'DESC').getOne();
  }

  async Save(role: RolesDto): Promise<Roles> {
    await this.datasource
      .createQueryBuilder()
      .insert()
      .into(Roles)
      .values({
        role_id: role.role_id,
        name: role.name,
        status_active: role.status_active,
        flag_read: role.flag_read,
        flag_insert: role.flag_insert,
        flag_update: role.flag_update,
        flag_delete: role.flag_delete,
      })
      .execute();

    return this.datasource.getRepository(Roles).createQueryBuilder().where('role_id = :role_id', { role_id: role.role_id }).getOne();
  }

  async Update(role_id: string, role: RolesDto): Promise<Roles> {
    await this.datasource
      .createQueryBuilder()
      .update(Roles)
      .set({
        name: role.name,
        flag_read: role.flag_read,
        flag_insert: role.flag_insert,
        flag_update: role.flag_update,
        flag_delete: role.flag_delete,
      })
      .where('role_id = :role_id', { role_id })
      .execute();

    return this.datasource.getRepository(Roles).createQueryBuilder().where('role_id = :role_id', { role_id }).getOne();
  }

  async Delete(role_id: string): Promise<void> {
    this.datasource.createQueryBuilder().update(Roles).set({ status_active: false }).where('role_id = :role_id', { role_id }).execute();
  }
}
