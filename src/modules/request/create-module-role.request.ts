import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDefined, IsNotEmpty, ValidateNested } from 'class-validator';
import { ToBoolean } from '../../common/decorators';

class ModuleDto {
  @IsNotEmpty({ message: 'Module ID wajib diisi' })
  module_id: string;

  @IsNotEmpty({ message: 'Status aktif wajib diisi' })
  @ToBoolean()
  status_active: boolean;
}

export class CreateModuleRoleRequest {
  @IsNotEmpty({ message: 'Role ID wajib diisi' })
  role_id: string;

  @ArrayNotEmpty()
  @IsDefined()
  @IsArray()
  @Type(() => ModuleDto)
  @ValidateNested({ each: true })
  modules: ModuleDto[];
}
