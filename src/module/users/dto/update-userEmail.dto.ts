import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserEmailDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsBoolean()
  @IsOptional()
  isPrimary: boolean;
}
