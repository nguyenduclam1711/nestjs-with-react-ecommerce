import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  AuthLoginBodySchema,
  authLoginBodySchema,
  AuthRegisterBodySchema,
  authRegisterBodySchema,
} from 'src/schemas/auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @UsePipes(new ZodValidationPipe(authRegisterBodySchema))
  async register(
    @Body()
    body: AuthRegisterBodySchema,
  ) {
    const { password, name, email } = body;
    return this.authService.register({
      email,
      name,
      password,
    });
  }

  @Post('/login')
  @UsePipes(new ZodValidationPipe(authLoginBodySchema))
  async login(
    @Body()
    body: AuthLoginBodySchema,
  ) {
    const { password, email } = body;
    return this.authService.login({
      email,
      password,
    });
  }
}
