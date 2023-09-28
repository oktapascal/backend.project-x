import { ArrayNotEmpty, IsArray, IsDefined, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ToBoolean } from '../../common/decorators';
import { Type } from 'class-transformer';

class MenuDto {
  @IsNotEmpty({ message: 'Nama menu wajib diisi' })
  name: string;

  @IsNotEmpty({ message: 'URL menu wajib diisi' })
  path_url: string;

  @IsNotEmpty({ message: 'Status active wajib diisi' })
  @ToBoolean()
  status_active: boolean;

  @IsOptional()
  @IsArray()
  @Type(() => MenuDto)
  @ValidateNested({ each: true })
  children?: MenuDto[];
}

export class CreateModuleMenuRequest {
  @IsNotEmpty({ message: 'Module ID wajib diisi' })
  module_id: string;

  @ArrayNotEmpty()
  @IsDefined()
  @IsArray()
  @Type(() => MenuDto)
  @ValidateNested({ each: true })
  menus: MenuDto[];
}
