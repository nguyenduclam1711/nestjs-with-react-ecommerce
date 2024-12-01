import { PERMISSION_CODE } from 'src/constants/permission';

export const INIT_PERMISSIONS = Object.values(PERMISSION_CODE).map((code) => {
  return {
    code,
    name: code.split('_').join(' '),
  };
});
