import { Global, Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';

@Global()
@Module({
  providers: [UserRolesService],
  exports: [UserRolesService],
})
export class UserRolesModule {}
