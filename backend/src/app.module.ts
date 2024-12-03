import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TestController } from './test.controller';
import { RedisModule } from './modules/redis/redis.module';
import { InitDataService } from './common/services/init-data.service';
import { RolePermissionsModule } from './modules/role-permissions/role-permissions.module';
import { UserRolesModule } from './modules/user-roles/user-roles.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    AuthModule,
    RolePermissionsModule,
    UserRolesModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [TestController],
  providers: [InitDataService],
})
export class AppModule {}
