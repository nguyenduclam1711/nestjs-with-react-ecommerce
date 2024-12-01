import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PasswordUtil } from 'src/common/utils/password.util';
import { ROLE_DEFAULT_CODE } from 'src/constants/role';
import { INIT_PERMISSIONS } from 'src/init-data/permission.init';
import { INIT_ROLE_PERMISSIONS } from 'src/init-data/role-permission.init';
import { INIT_ROLES } from 'src/init-data/role.init';
import { INIT_ADMIN } from 'src/init-data/user.init';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.initData();
  }

  private async initData() {
    await this.initPermissions();
    await this.initRoles();
    await this.initRolePermissions();
    await this.initAdminUser();
    console.log('Init data');
  }

  private async initPermissions() {
    await Promise.all(
      INIT_PERMISSIONS.map((permission) => {
        return this.permisison.upsert({
          where: {
            code: permission.code,
          },
          create: {
            name: permission.name,
            code: permission.code,
          },
          update: {
            name: permission.name,
          },
        });
      }),
    );
    console.log('Init permissions');
  }

  private async initRoles() {
    await Promise.all(
      INIT_ROLES.map(async (role) => {
        return this.role.upsert({
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
    await Promise.all(
      INIT_ROLE_PERMISSIONS.map(async (rolePermission) => {
        const { roleCode, permissionCodes } = rolePermission;
        return Promise.all(
          permissionCodes.map(async (permissionCode) => {
            return this.rolePermission.upsert({
              where: {
                roleCode_permissionCode: {
                  roleCode,
                  permissionCode,
                },
              },
              create: {
                roleCode,
                permissionCode,
              },
              update: {},
            });
          }),
        );
      }),
    );
    console.log('Init role permissions');
  }

  async initAdminUser() {
    const { name, email, password } = INIT_ADMIN;

    if (!email || !password) {
      throw new Error('Init admin email or password is not defined');
    }
    const createdAdmin = await this.user.upsert({
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
    const existedUserCredential = await this.userCredential.findFirst({
      where: {
        userId: createdAdmin.id,
      },
    });
    if (!existedUserCredential) {
      const hashedPassword =
        await PasswordUtil.generateHashedPassword(password);
      await this.userCredential.create({
        data: {
          password: hashedPassword,
          userId: createdAdmin.id,
        },
      });
    }
    await this.userRole.upsert({
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
