import { PermissionUtil } from '../utils/permission.util';

export class PrismaBaseService<PrismaModel> {
  modelName: string;
  permission: {
    viewPermission: string;
    viewDetailPermission: string;
    updatePermission: string;
    deletePermission: string;
  };

  constructor(public prismaModel: PrismaModel) {
    this.modelName = (prismaModel as any).name;
    this.permission = PermissionUtil.getAllPermissionCode(this.modelName);
  }
}
