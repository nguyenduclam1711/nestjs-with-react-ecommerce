import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../prisma/prisma.service';
import { set } from 'lodash';
import { PrismaBaseService } from 'src/common/services/permission-code.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RolePermissionsService extends PrismaBaseService<
  PrismaClient['rolePermission']
> {
  rolePermisisonsRedisPrefix = 'role:permissions:';

  constructor(
    private redisService: RedisService,
    private prisma: PrismaService,
  ) {
    super(prisma.rolePermission);
  }

  private getRolePermissionRedisKey(roleCode: string) {
    return `${this.rolePermisisonsRedisPrefix}${roleCode}`;
  }

  async deleteRolePermissionsInRedis() {
    return this.redisService.deleteKeysWithPrefix(
      this.rolePermisisonsRedisPrefix,
    );
  }

  async setRolePermissionsInRedis() {
    const rolePermissions = await this.prismaModel.findMany();
    const mapRoleToPermissions: {
      [roleCode: string]: {
        [permissionCode: string]: boolean;
      };
    } = rolePermissions.reduce((acc, rolePermission) => {
      const { roleCode, permissionCode } = rolePermission;
      set(acc, [roleCode, permissionCode], true);
      return acc;
    }, {});

    await this.deleteRolePermissionsInRedis();
    await Promise.all(
      Object.keys(mapRoleToPermissions).map(async (roleCode) => {
        return this.redisService.setValue(
          this.getRolePermissionRedisKey(roleCode),
          JSON.stringify(mapRoleToPermissions[roleCode]),
        );
      }),
    );
  }

  async getRolePermissions(roleCode: string): Promise<{
    [permissionCode: string]: boolean;
  }> {
    return this.redisService.getFromRedisOrDb({
      redisKey: this.getRolePermissionRedisKey(roleCode),
      getFromDb: async () => {
        const rolePermissions = await this.prismaModel.findMany({
          where: {
            roleCode,
          },
        });
        return rolePermissions.reduce(
          (
            acc: {
              [permissionCode: string]: boolean;
            },
            rolePermission,
          ) => {
            const { permissionCode } = rolePermission;
            set(acc, permissionCode, true);
            return acc;
          },
          {},
        );
      },
    });
  }
}
