import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateModuleRequest {
  @IsNotEmpty({ message: 'ID modul wajib diisi' })
  @MaxLength(7, { message: 'ID modul maksimal $constraint1 karakter' })
  id: string;

  @IsNotEmpty({ message: 'Nama modul wajib diisi' })
  @MaxLength(50, { message: 'Nama modul maksimal $constraint1 karakter' })
  @ApiProperty({
    description: 'Nama modul',
  })
  name: string;

  @IsNotEmpty({ message: 'Icon modul wajib diisi' })
  @MaxLength(25, { message: 'Nama modul maksimal $constraint1 karakter' })
  @ApiProperty({
    description: 'Icon modul',
  })
  icon: string;

  @IsNotEmpty({ message: 'Default view wajib diisi' })
  @MaxLength(50, { message: 'Default view maksimal $constraint1 karakter' })
  @ApiProperty({
    description: 'Default url modul',
  })
  default_view: string;
}
