import { ArrayNotEmpty, IsArray, IsDefined, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ToBoolean } from '../../common/decorators';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class MenuDto {
  @IsNotEmpty({ message: 'ID Menu wajib diisi' })
  @ApiProperty({
    description: 'ID menu',
  })
  menu_id: string;

  @IsNotEmpty({ message: 'Status active wajib diisi' })
  @ToBoolean()
  @ApiProperty({
    description: 'Status aktif menu',
  })
  status_active: boolean;

  @IsOptional()
  @IsArray()
  @Type(() => MenuDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: false,
    type: [MenuDto],
  })
  children?: MenuDto[];
}

export class CreateModuleMenuRequest {
  @IsNotEmpty({ message: 'Module ID wajib diisi' })
  @ApiProperty({
    description: 'Module ID',
  })
  module_id: string;

  @ArrayNotEmpty()
  @IsDefined()
  @IsArray()
  @Type(() => MenuDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    type: [MenuDto],
  })
  menus: MenuDto[];
}
