import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UserCredentialsModule } from '../user-credentials/user-credentials.module';

@Module({
  imports: [UsersModule, UserCredentialsModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
