import { Injectable, OnModuleInit } from '@nestjs/common';
import { INIT_ROLES } from 'src/init-data/role.init';
import { INIT_ADMIN } from 'src/init-data/user.init';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PasswordUtil } from '../utils/password.util';
import { ROLE_DEFAULT_CODE } from 'src/constants/role';
import { RolePermissionsService } from 'src/modules/role-permissions/role-permissions.service';
import { ModelPermission } from 'src/schemas/permission.schema';
import { PermissionUtil } from '../utils/permission.util';

@Injectable()
export class InitDataService implements OnModuleInit {
  models: string[];
  modelPermissions: ModelPermission[];

  constructor(
    private prisma: PrismaService,
    private rolePermissionsService: RolePermissionsService,
  ) {
    this.models = Object.keys((prisma as any)._runtimeDataModel.models);
    this.modelPermissions = this.models.map((modelName) =>
      PermissionUtil.getAllPermissionCode(modelName),
    );
  }

  async onModuleInit() {
    await this.initData();
  }

  private async initData() {
    await this.initPermissions();
    await this.initRoles();
    await this.initRolePermissions();
    await this.initAdminUser();
    console.log('Init data');
  }

  private async initPermission(permissionCode: string) {
    return this.prisma.permission.upsert({
      where: {
        code: permissionCode,
      },
      create: {
        name: permissionCode,
        code: permissionCode,
        type: 'DEFAULT',
      },
      update: {
        name: permissionCode,
      },
    });
  }

  private async initPermissions() {
    await Promise.all(
      this.modelPermissions.map(async (modelPermission) => {
        return Promise.all([
          this.initPermission(modelPermission.viewPermission),
          this.initPermission(modelPermission.viewDetailPermission),
          this.initPermission(modelPermission.updatePermission),
          this.initPermission(modelPermission.deletePermission),
        ]);
      }),
    );
    console.log('Init permissions');
  }

  private async initRoles() {
    await Promise.all(
      INIT_ROLES.map(async (role) => {
        return this.prisma.role.upsert({
          where: {
            code: role.code,
          },
          create: {
            name: role.name,
            code: role.code,
          },
          update: {
            name: role.name,
          },
        });
      }),
    );
    console.log('Init roles');
  }

  private async initRolePermissions() {
    await this.rolePermissionsService.setRolePermissionsInRedis();
    console.log('Init role permissions');
  }

  async initAdminUser() {
    const { name, email, password } = INIT_ADMIN;

    if (!email || !password) {
      throw new Error('Init admin email or password is not defined');
    }
    const createdAdmin = await this.prisma.user.upsert({
      where: {
        email,
      },
      create: {
        name,
        email,
      },
      update: {
        name,
      },
    });
    const existedUserCredential = await this.prisma.userCredential.findFirst({
      where: {
        userId: createdAdmin.id,
      },
    });
    if (!existedUserCredential) {
      const hashedPassword =
        await PasswordUtil.generateHashedPassword(password);
      await this.prisma.userCredential.create({
        data: {
          password: hashedPassword,
          userId: createdAdmin.id,
        },
      });
    }
    await this.prisma.userRole.upsert({
      where: {
        userId_roleCode: {
          userId: createdAdmin.id,
          roleCode: ROLE_DEFAULT_CODE.ADMIN,
        },
      },
      create: {
        userId: createdAdmin.id,
        roleCode: ROLE_DEFAULT_CODE.ADMIN,
      },
      update: {},
    });

    console.log('Init admin user');
  }
}
