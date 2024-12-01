import { PERMISSION_CODE } from 'src/constants/permission';
import { ROLE_DEFAULT_CODE } from 'src/constants/role';

export const INIT_ROLE_PERMISSIONS = [
  {
    roleCode: ROLE_DEFAULT_CODE.ADMIN,
    permissionCodes: Object.values(PERMISSION_CODE),
  },
];
