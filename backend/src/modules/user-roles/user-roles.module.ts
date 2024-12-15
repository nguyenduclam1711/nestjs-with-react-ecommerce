import { Global, Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { UserRolesController } from './user-roles.controller';

@Global()
@Module({
  providers: [UserRolesService],
  exports: [UserRolesService],
  controllers: [UserRolesController],
})
export class UserRolesModule {}
