import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from './common/guards/jwt.guard';

@Controller('test')
export class TestController {
  @Get()
  @UseGuards(JwtGuard)
  test() {
    return 'heheh';
  }
}
