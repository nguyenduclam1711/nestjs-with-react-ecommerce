import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ACCESS_TOKEN_SECRET_KEY } from 'src/constants/jwt';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { JwtPayload } from 'src/schemas/jwt.schema';
import { UserRolesService } from 'src/modules/user-roles/user-roles.service';
import { RolePermissionsService } from 'src/modules/role-permissions/role-permissions.service';
import { ROLE_DEFAULT_CODE } from 'src/constants/role';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userRolesService: UserRolesService,
    private rolePermissionsService: RolePermissionsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isAuthenticate = await this.authenticate(request);
    if (!isAuthenticate) {
      throw new UnauthorizedException();
    }
    const isAuthorize = await this.authorize(context);
    if (!isAuthorize) {
      throw new ForbiddenException();
    }
    return true;
  }

  private async authenticate(request: Request) {
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: ACCESS_TOKEN_SECRET_KEY,
      });
      request['user'] = payload;
    } catch {
      return false;
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isAdmin(
    userRoles: Array<{
      userId: number;
      roleCode: string;
      createdAt: Date;
      updatedAt: Date | null;
    }>,
  ) {
    return userRoles.some(
      (userRole) => userRole.roleCode === ROLE_DEFAULT_CODE.ADMIN,
    );
  }

  private async authorize(context: ExecutionContext) {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const { id: userId } = user as JwtPayload;
    const userRoles = await this.userRolesService.findMany({
      where: {
        userId,
      },
    });
    const isAdmin = this.isAdmin(userRoles);
    if (isAdmin) {
      return true;
    }
    const rolePermissions = await Promise.all(
      userRoles.map(async (userRole) => {
        const { roleCode } = userRole;
        return this.rolePermissionsService.getRolePermissions(roleCode);
      }),
    );
    const userPermissions = rolePermissions.reduce((acc, rolePermission) => {
      return {
        ...acc,
        ...rolePermission,
      };
    }, {});

    return requiredPermissions.some((requiredPermission) => {
      return userPermissions[requiredPermission];
    });
  }
}
