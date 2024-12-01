import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TestController } from './test.controller';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    AuthModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [TestController],
  providers: [],
})
export class AppModule {}
