import { Controller, Get, Query } from '@nestjs/common';
import { kebabCase } from 'lodash';
import { PermissionUtil } from '../utils/permission.util';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { MODEL } from 'src/constants/model';
import { Auth } from '../decorators/auth.decorator';
import { BaseControllerFindManyDto } from 'src/schemas/base-controller.schema';

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
    // @Auth(permission.viewPermission)
    async findMany(
      @Query()
      query: BaseControllerFindManyDto,
    ) {
      console.log('query', query);
      return this.prismaModel.findMany(query);
    }
  }

  return BaseController;
}
