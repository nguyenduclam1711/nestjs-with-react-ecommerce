import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { kebabCase } from 'lodash';
import { PermissionUtil } from '../utils/permission.util';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { MODEL } from 'src/constants/model';
import { Auth } from '../decorators/auth.decorator';
import { PAGINATION_DEFAULT_PAGE_SIZE } from 'src/constants/pagination';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  BaseControllerFindManySchema,
  BaseControllerFindManyType,
} from 'src/schemas/base-controller.schema';

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
    @UsePipes(new ZodValidationPipe(BaseControllerFindManySchema, 'query'))
    @Auth(permission.viewPermission)
    async findMany(
      @Query()
      query: BaseControllerFindManyType,
    ) {
      const {
        where,
        include,
        select,
        orderBy,
        distinct,
        page: pageQuery,
        size: sizeQuery,
      } = query;
      const page = typeof pageQuery === 'number' ? pageQuery : 1;
      const size =
        typeof sizeQuery === 'number'
          ? sizeQuery
          : PAGINATION_DEFAULT_PAGE_SIZE;

      return this.prismaModel.findMany({
        where,
        include,
        select,
        orderBy,
        distinct,
        skip: (page - 1) * size,
      });
    }
  }

  return BaseController;
}
