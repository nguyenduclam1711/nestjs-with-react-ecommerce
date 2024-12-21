import { UnprocessableEntityException } from '@nestjs/common';
import { Response } from 'express';
import {
  REFRESH_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_EXPIRATION_IN_MILISECONDS,
  REFRESH_TOKEN_FAIL_MESSAGE,
} from 'src/constants/jwt';

export const TokenUtil = {
  setResponseRefreshTokenCookie(res: Response, refreshToken: string) {
    const now = new Date().valueOf();
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
      sameSite: 'strict',
      httpOnly: true,
      path: '/',
      secure: true,
      expires: new Date(now + REFRESH_TOKEN_EXPIRATION_IN_MILISECONDS),
    });
  },
  removeResponseRefreshTokenCookie(res: Response) {
    res.clearCookie(REFRESH_TOKEN_COOKIE_KEY, {
      path: '/',
    });
  },
  throwRefreshTokenFailsError() {
    throw new UnprocessableEntityException(REFRESH_TOKEN_FAIL_MESSAGE);
  },
};
