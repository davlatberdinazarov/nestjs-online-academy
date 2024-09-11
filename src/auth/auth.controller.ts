import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('phone') phone: string, @Body('password') password: string) {
    // Login endpointiga phone va password beriladi
    return this.authService.login(phone, password);
  }
}
