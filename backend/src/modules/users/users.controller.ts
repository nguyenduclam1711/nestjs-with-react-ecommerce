import { Get } from '@nestjs/common';
import { BaseControllerFactory } from 'src/common/controllers/base.controller';

export class UsersController extends BaseControllerFactory('USER') {
  @Get('/test')
  test() {
    return 'Test';
  }
}
