import ms from 'ms';

export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
export const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
export const REFRESH_TOKEN_EXPIRATION =
  process.env.REFRESH_TOKEN_EXPIRATION ?? '7d';

export const REFRESH_TOKEN_EXPIRATION_IN_MILISECONDS = ms(
  REFRESH_TOKEN_EXPIRATION,
);

// Redis expire time in seconds
export const REFRESH_TOKEN_EXPIRATION_TIME_IN_REDIS =
  REFRESH_TOKEN_EXPIRATION_IN_MILISECONDS / 1000;

export const REFRESH_TOKEN_COOKIE_KEY = 'refreshToken';
export const REFRESH_TOKEN_FAIL_MESSAGE = 'Refresh token fails';
