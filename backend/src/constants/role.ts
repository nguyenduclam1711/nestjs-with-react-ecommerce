import { PERMISSION_CODE } from './permission';

export const ROLE_DEFAULT_CODE = {
  ADMIN: 'admin',
  BUYER: 'buyer',
  SELLER: 'seller',
} as const;

export const ROLE_PERMISSIONS_MAPPING = {
  [ROLE_DEFAULT_CODE.ADMIN]: Object.values(PERMISSION_CODE),
  [ROLE_DEFAULT_CODE.BUYER]: [],
  [ROLE_DEFAULT_CODE.SELLER]: [],
};
