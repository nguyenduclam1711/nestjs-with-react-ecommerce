import { Controller, Get } from '@nestjs/common';
import { kebabCase } from 'lodash';
import { PermissionUtil } from '../utils/permission.util';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { MODEL } from 'src/constants/model';
import { Auth } from '../decorators/auth.decorator';

export function BaseControllerFactory(modelField: keyof typeof MODEL) {
  const model = MODEL[modelField];
  const prefixEndpoint = `${kebabCase(model.modelName)}s`;
  const permission = PermissionUtil.getAllPermissionCode(model.modelName);

  @Controller(prefixEndpoint)
  class BaseController {
    prismaModel: any;

    constructor(prismaService: PrismaService) {
      this.prismaModel = prismaService[model.prismaModelField];
    }

    @Get()
    @Auth(permission.viewPermission)
    async findMany() {
      return this.prismaModel.findMany();
    }
  }

  return BaseController;
}
