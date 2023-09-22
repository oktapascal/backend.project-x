import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateModuleRequest {
  @IsNotEmpty({ message: 'ID modul wajib diisi' })
  @MaxLength(7, { message: 'ID modul maksimal $constraint1 karakter' })
  id: string;

  @IsNotEmpty({ message: 'Nama modul wajib diisi' })
  @MaxLength(50, { message: 'Nama modul maksimal $constraint1 karakter' })
  name: string;

  @IsNotEmpty({ message: 'Icon modul wajib diisi' })
  @MaxLength(25, { message: 'Nama modul maksimal $constraint1 karakter' })
  icon: string;
}
