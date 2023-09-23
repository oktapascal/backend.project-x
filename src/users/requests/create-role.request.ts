import { IsNotEmpty, MaxLength } from 'class-validator';
import { ToBoolean } from '../../common/decorators';

export class CreateRoleRequest {
  @IsNotEmpty({ message: 'Nama role wajib diisi' })
  @MaxLength(25, { message: 'Nama role maksimal $constraint1 karakter' })
  name: string;

  @IsNotEmpty({ message: 'Flag read wajib diisi' })
  @ToBoolean()
  flag_read: boolean;

  @IsNotEmpty({ message: 'Flag insert wajib diisi' })
  @ToBoolean()
  flag_insert: boolean;

  @IsNotEmpty({ message: 'Flag update wajib diisi' })
  @ToBoolean()
  flag_update: boolean;

  @IsNotEmpty({ message: 'Flag delete wajib diisi' })
  @ToBoolean()
  flag_delete: boolean;
}
