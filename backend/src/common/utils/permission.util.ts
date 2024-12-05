import { PERMISSION_PREFIX } from 'src/constants/permission';
import { ModelPermission } from 'src/schemas/permission.schema';

export const PermissionUtil = {
  getPermisisonCode(prefix: string, modelName: string) {
    return `${prefix}_${modelName}`;
  },
  getAllPermissionCode(modelName: string): ModelPermission {
    return {
      viewPermission: PermissionUtil.getPermisisonCode(
        PERMISSION_PREFIX.VIEW,
        modelName,
      ),
      viewDetailPermission: PermissionUtil.getPermisisonCode(
        PERMISSION_PREFIX.VIEW_DETAIL,
        modelName,
      ),
      updatePermission: PermissionUtil.getPermisisonCode(
        PERMISSION_PREFIX.UPDATE,
        modelName,
      ),
      deletePermission: PermissionUtil.getPermisisonCode(
        PERMISSION_PREFIX.DELETE,
        modelName,
      ),
    };
  },
};
