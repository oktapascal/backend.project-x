import { Expose, Type } from 'class-transformer';

class RoleDto {
  @Expose()
  flag_read: boolean;

  @Expose()
  flag_insert: boolean;

  @Expose()
  flag_update: boolean;

  @Expose()
  flag_delete: boolean;
}

class UserDto {
  @Expose()
  user_id: string;

  @Expose()
  username: string;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}

export class UserSessionDto {
  @Expose()
  access_token: string;

  @Expose()
  refresh_token: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
