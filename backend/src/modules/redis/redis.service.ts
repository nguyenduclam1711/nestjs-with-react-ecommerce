import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PROVIDER } from 'src/constants/provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject(PROVIDER.REDIS_CLIENT)
    private redis: Redis,
  ) {}

  async getFromRedisOrDb({
    redisKey,
    getFromDb,
    ttl,
  }: {
    redisKey: string;
    getFromDb: () => Promise<any>;
    ttl?: number;
  }) {
    const resultFromRedis = await this.redis.get(redisKey);
    if (resultFromRedis) {
      return JSON.parse(resultFromRedis);
    }
    const resultFromDb = await getFromDb();
    await this.redis.set(redisKey, JSON.stringify(resultFromDb));
    if (ttl) {
      await this.redis.expire(redisKey, ttl);
    }
    return resultFromDb;
  }
}
