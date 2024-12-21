import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  AuthLoginBodyDto,
  authLoginBodySchema,
  AuthRegisterBodyDto,
  authRegisterBodySchema,
  AuthRegisterResponse,
} from 'src/schemas/auth.schema';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtTokens } from 'src/schemas/jwt.schema';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { REFRESH_TOKEN_COOKIE_KEY } from 'src/constants/jwt';
import { TokenUtil } from 'src/common/utils/token.util';

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

  private handleSendTokens(args: {
    res: ExpressResponse;
    accessToken: string;
    refreshToken: string;
  }) {
    const { res, accessToken, refreshToken } = args;

    TokenUtil.setResponseRefreshTokenCookie(res, refreshToken);
    res.status(200).json({
      accessToken,
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
    @Response()
    res: ExpressResponse,
  ) {
    const { password, email } = body;
    const { accessToken, refreshToken } = await this.authService.login({
      email,
      password,
    });
    this.handleSendTokens({
      res,
      refreshToken,
      accessToken,
    });
  }

  @Post('/refresh')
  @ApiOkResponse({
    type: JwtTokens,
  })
  async refreshToken(
    @Response()
    res: ExpressResponse,
    @Request()
    req: ExpressRequest,
  ) {
    const cookieRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE_KEY];
    if (!cookieRefreshToken) {
      TokenUtil.throwRefreshTokenFailsError();
    }
    const { accessToken, refreshToken } =
      await this.authService.refreshAccessToken(cookieRefreshToken);
    this.handleSendTokens({
      res,
      refreshToken,
      accessToken,
    });
  }
}
