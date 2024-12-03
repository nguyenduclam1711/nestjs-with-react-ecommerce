import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PROVIDER } from 'src/constants/provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject(PROVIDER.REDIS_CLIENT)
    private redis: Redis,
  ) {}

  async deleteKeysWithPrefix(prefix: string) {
    const pattern = `${prefix}*`;
    let cursor = 0;

    do {
      const [newCursor, keys] = await this.redis.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = parseInt(newCursor, 10);
      if (keys.length) {
        await this.redis.del(...keys);
      }
    } while (cursor !== 0);
  }

  async setValue(
    key: string,
    value: string | number | Buffer,
    ttl?: string | number,
  ) {
    await this.redis.set(key, value);
    if (ttl) {
      await this.redis.expire(key, ttl);
    }
  }

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
    await this.setValue(redisKey, JSON.stringify(resultFromDb), ttl);
    return resultFromDb;
  }
}
