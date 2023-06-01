import { IsBoolean, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserEmailDto {
  @ApiProperty({
    description: 'Novo Email',
    default: 'userteste_1@mail.com',
    type: String,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'Tornar o email de login',
    default: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isPrimary: boolean;
}
