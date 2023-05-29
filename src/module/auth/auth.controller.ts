import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

interface iUserLogin {
  email: string;
  password: string;
}
@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('')
  @UseGuards(LocalAuthGuard)
  async login(@Body() user: iUserLogin) {
    return this.authService.login(user.email);
  }
}
