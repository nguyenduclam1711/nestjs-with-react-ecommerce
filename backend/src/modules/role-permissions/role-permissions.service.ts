import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../prisma/prisma.service';
import { set } from 'lodash';

@Injectable()
export class RolePermissionsService {
  rolePermisisonsRedisPrefix = 'role:permissions:';

  constructor(
    private redisService: RedisService,
    private prisma: PrismaService,
  ) {}

  private getRolePermissionRedisKey(roleCode: string) {
    return `${this.rolePermisisonsRedisPrefix}${roleCode}`;
  }

  async deleteRolePermissionsInRedis() {
    return this.redisService.deleteKeysWithPrefix(
      this.rolePermisisonsRedisPrefix,
    );
  }

  async setRolePermissionsInRedis() {
    const rolePermissions = await this.prisma.rolePermission.findMany();
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
        const rolePermissions = await this.prisma.rolePermission.findMany({
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
