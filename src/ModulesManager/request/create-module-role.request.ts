import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDefined, IsNotEmpty, ValidateNested } from 'class-validator';
import { ToBoolean } from '../../common/decorators';
import { ApiProperty } from '@nestjs/swagger';

class ModuleDto {
  @IsNotEmpty({ message: 'Module ID wajib diisi' })
  @ApiProperty({
    description: 'Module ID',
  })
  module_id: string;

  @IsNotEmpty({ message: 'Status aktif wajib diisi' })
  @ToBoolean()
  @ApiProperty({
    description: 'Status aktif module',
  })
  status_active: boolean;
}

export class CreateModuleRoleRequest {
  @IsNotEmpty({ message: 'Role ID wajib diisi' })
  @ApiProperty({
    description: 'Role ID',
  })
  role_id: string;

  @ArrayNotEmpty()
  @IsDefined()
  @IsArray()
  @Type(() => ModuleDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    type: [ModuleDto],
  })
  modules: ModuleDto[];
}
