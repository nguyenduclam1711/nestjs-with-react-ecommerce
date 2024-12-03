import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TestController } from './test.controller';
import { RedisModule } from './modules/redis/redis.module';
import { InitDataService } from './common/services/init-data.service';
import { RolePermissionsModule } from './modules/role-permissions/role-permissions.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    AuthModule,
    RolePermissionsModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [TestController],
  providers: [InitDataService],
})
export class AppModule {}
