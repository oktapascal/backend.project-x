import { ArrayNotEmpty, IsArray, IsDefined, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ToBoolean } from '../../common/decorators';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class MenuDto {
  @IsNotEmpty({ message: 'Nama menu wajib diisi' })
  @ApiProperty({
    description: 'Nama menu',
  })
  name: string;

  @IsNotEmpty({ message: 'URL menu wajib diisi' })
  @ApiProperty({
    description: 'URL menu',
  })
  path_url: string;

  @IsNotEmpty({ message: 'Status active wajib diisi' })
  @ToBoolean()
  @ApiProperty({
    description: 'Status aktif menu',
  })
  status_active: boolean;

  @IsNotEmpty({ message: 'Menu icon wajib diisi' })
  @ApiProperty({
    description: 'Icon menu',
  })
  menu_icon: string;

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
