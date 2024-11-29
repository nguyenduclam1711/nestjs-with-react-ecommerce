import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from './common/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('test')
export class TestController {
  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtGuard)
  test() {
    return 'heheh';
  }
}
