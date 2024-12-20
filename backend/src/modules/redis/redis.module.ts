import { Global, Module, Scope } from '@nestjs/common';
import Redis from 'ioredis';
import { PROVIDER } from 'src/constants/provider';
import { REDIS_URL } from 'src/constants/redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: PROVIDER.REDIS_CLIENT,
      useFactory: () => {
        if (!REDIS_URL) {
          throw new Error('Redis url is not defined in env');
        }
        const client = new Redis(REDIS_URL);
        return client;
      },
      scope: Scope.DEFAULT,
    },
    RedisService,
  ],
  exports: [PROVIDER.REDIS_CLIENT, RedisService],
})
export class RedisModule {}
