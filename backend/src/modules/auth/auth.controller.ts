import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(
    @Body()
    body: any,
  ) {
    const { password, name, email } = body;
    return this.authService.register({
      email,
      name,
      password,
    });
  }

  @Post('/login')
  async login(
    @Body()
    body: any,
  ) {
    const { password, email } = body;
    return this.authService.login({
      email,
      password,
    });
  }
}
