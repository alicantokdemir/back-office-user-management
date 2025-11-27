export const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';

export const JWT_ACCESS_TOKEN_EXPIRY = '15m';
export const ACCESS_TOKEN_COOKIE_AGE = 15 * 60 * 1000; // 15 minutes in milliseconds
export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
export const JWT_REFRESH_TOKEN_EXPIRY = '7d';
export const REFRESH_TOKEN_COOKIE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export const HASHING_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};
