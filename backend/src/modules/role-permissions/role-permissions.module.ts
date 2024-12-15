import { Global, Module } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { RolePermissions } from './role-permissions.controller';

@Global()
@Module({
  providers: [RolePermissionsService],
  exports: [RolePermissionsService],
  controllers: [RolePermissions],
})
export class RolePermissionsModule {}
