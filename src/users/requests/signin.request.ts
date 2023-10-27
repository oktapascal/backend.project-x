import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class SigninRequest {
  @IsNotEmpty({ message: 'username wajib diisi' })
  @ApiProperty({
    description: 'Username user',
  })
  username: string;

  @IsNotEmpty({ message: 'password wajib diisi' })
  @ApiProperty({
    description: 'Password user',
  })
  password: string;

  @IsOptional()
  ip_address: string;

  @IsOptional()
  user_agent: string | undefined;
}
