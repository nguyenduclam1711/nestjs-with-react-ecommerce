import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  AuthLoginBodyDto,
  authLoginBodySchema,
  AuthLoginResponse,
  AuthRegisterBodyDto,
  authRegisterBodySchema,
  AuthRegisterResponse,
} from 'src/schemas/auth.schema';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @UsePipes(new ZodValidationPipe(authRegisterBodySchema))
  @ApiOkResponse({
    type: AuthRegisterResponse,
  })
  async register(
    @Body()
    body: AuthRegisterBodyDto,
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
  @ApiOkResponse({
    type: AuthLoginResponse,
  })
  async login(
    @Body()
    body: AuthLoginBodyDto,
  ) {
    const { password, email } = body;
    return this.authService.login({
      email,
      password,
    });
  }
}
