import { ROLE_DEFAULT_CODE } from 'src/constants/role';

export const INIT_ROLES = Object.values(ROLE_DEFAULT_CODE).map((code) => ({
  code,
  name: code,
}));
