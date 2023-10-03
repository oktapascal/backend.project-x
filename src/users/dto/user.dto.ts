import { Expose, Type } from 'class-transformer';
import { UserProfileDto } from './user-profile.dto';
import { RolesDto } from './roles.dto';

export class UserDto {
  id?: number;

  @Expose()
  user_id?: string;

  @Expose()
  username: string;

  password: string;

  @Expose()
  role_id: string;

  @Expose()
  activated?: boolean;

  updated_at?: Date;

  @Expose()
  @Type(() => UserProfileDto)
  profile: UserProfileDto;

  @Expose()
  @Type(() => RolesDto)
  role: RolesDto;
}
