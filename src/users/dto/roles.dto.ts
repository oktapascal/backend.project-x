import { Expose } from 'class-transformer';

export class RolesDto {
  @Expose()
  role_id: string;

  @Expose()
  name: string;

  @Expose()
  status_active: boolean;

  @Expose()
  flag_read: boolean;

  @Expose()
  flag_insert: boolean;

  @Expose()
  flag_update: boolean;

  @Expose()
  flag_delete: boolean;
}
