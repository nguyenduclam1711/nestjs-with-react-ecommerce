import { Controller, Get, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { PROVIDER } from './constants/provider';

@Controller('test')
export class TestController {
  constructor(
    @Inject(PROVIDER.REDIS_CLIENT)
    private redisService: Redis,
  ) {}

  @Get()
  async test() {
    await this.redisService.set('test', new Date().toISOString());
    const result = await this.redisService.get('test');
    return {
      result,
    };
  }
}
