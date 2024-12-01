import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserCredentialsModule } from './modules/user-credentials/user-credentials.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TestController } from './test.controller';
import { RedisModule } from './modules/redis/redis.module';
import { PermissionsModule } from './modules/permisisons/permissions.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    UsersModule,
    UserCredentialsModule,
    AuthModule,
    PermissionsModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [TestController],
  providers: [],
})
export class AppModule {}
