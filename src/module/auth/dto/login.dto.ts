/* import { ApiProperty } from '@nestjs/swagger'; */
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: 'Email do Usuário',
    default: 'userteste@mail.com',
    type: String,
  })
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Telefone do Usuário',
    default: '1125258565',
    type: String,
  })
  @ApiProperty()
  @IsString()
  password: string;
}
