import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMenuRequest {
  @IsNotEmpty({ message: 'Nama menu wajib diisi' })
  @MaxLength(50, { message: 'Nama menu maksimal $constraint1 karakter' })
  @ApiProperty({
    description: 'Nama menu',
  })
  name: string;

  @IsNotEmpty({ message: 'Icon menu wajib diisi' })
  @MaxLength(25, { message: 'Nama menu maksimal $constraint1 karakter' })
  @ApiProperty({
    description: 'Icon menu',
  })
  icon: string;

  @IsNotEmpty({ message: 'Path url menu wajib diisi' })
  @MaxLength(50, { message: 'Path url menu maksimal $constraint1 karakter' })
  @ApiProperty({
    description: 'Path url menu',
  })
  path_url: string;
}
