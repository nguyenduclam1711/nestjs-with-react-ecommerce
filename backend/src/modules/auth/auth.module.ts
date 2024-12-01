import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UserCredentialsModule } from '../user-credentials/user-credentials.module';
import { UserRolesModule } from '../user-roles/user-roles.module';

@Module({
  imports: [UsersModule, UserCredentialsModule, UserRolesModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
