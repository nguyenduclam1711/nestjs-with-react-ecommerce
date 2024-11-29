import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  AuthLoginBodyDto,
  authLoginBodySchema,
  AuthRefreshBodyDto,
  authRefreshBodySchema,
  AuthRegisterBodyDto,
  authRegisterBodySchema,
  AuthRegisterResponse,
} from 'src/schemas/auth.schema';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtTokens } from 'src/schemas/jwt.schema';

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
    type: JwtTokens,
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

  @Post('/refresh')
  @UsePipes(new ZodValidationPipe(authRefreshBodySchema))
  @ApiOkResponse({
    type: JwtTokens,
  })
  async refreshToken(
    @Body()
    body: AuthRefreshBodyDto,
  ) {
    const { refreshToken, accessToken } = body;
    return this.authService.refreshAccessToken(refreshToken, accessToken);
  }
}
