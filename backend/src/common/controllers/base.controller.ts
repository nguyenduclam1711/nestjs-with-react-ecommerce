import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { kebabCase } from 'lodash';
import { PermissionUtil } from '../utils/permission.util';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { MODEL, MODEL_DEFAULT_ID_PARAM_NAMES } from 'src/constants/model';
import { Auth } from '../decorators/auth.decorator';
import { PAGINATION_DEFAULT_PAGE_SIZE } from 'src/constants/pagination';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  BaseControllerFindManyDto,
  BaseControllerFindManySchema,
  getBaseControllerDetailParamsSchema,
} from 'src/schemas/base-controller.schema';
import { Record } from '@prisma/client/runtime/library';
import { ApiBody } from '@nestjs/swagger';
import { ApiIdParamNameQueries } from '../decorators/base-controller.decorator';

export function BaseControllerFactory(modelField: keyof typeof MODEL) {
  const model = MODEL[modelField];
  const prefixEndpoint = `${kebabCase(model.modelName)}s`;
  const permission = PermissionUtil.getAllPermissionCode(model.modelName);
  const baseControllerDetailParamsSchema =
    getBaseControllerDetailParamsSchema(modelField);
  const createOrUpdateSchema = model.createOrUpdateBodySchema;

  @Controller(prefixEndpoint)
  class BaseController {
    prismaModel: any;

    constructor(prismaService: PrismaService) {
      const prismaModelField = model.modelName;
      prismaModelField[0].toLowerCase();
      this.prismaModel = prismaService[prismaModelField];
    }

    getDetailWhere(query: any) {
      const where = {};
      const idParamNames = model.idParamNames ?? MODEL_DEFAULT_ID_PARAM_NAMES;
      if (idParamNames.length === 1) {
        where[idParamNames[0].name] = query[idParamNames[0].name];
      } else {
        const compositeId = idParamNames
          .map((idParamName) => idParamName.name)
          .join('_');
        where[compositeId] = {};
        idParamNames.forEach((paramName) => {
          where[compositeId][paramName.name] = query[paramName.name];
        });
      }
      return where;
    }

    @Get()
    @UsePipes(new ZodValidationPipe(BaseControllerFindManySchema, 'query'))
    @Auth(permission.viewPermission)
    async findMany(
      @Query()
      query: BaseControllerFindManyDto,
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
      const findManyArgs: Record<string, any> = {
        where,
        orderBy,
        distinct,
        skip: (page - 1) * size,
      };
      if (include && select) {
        findManyArgs.include = include;
      } else {
        findManyArgs.select = select;
      }

      return this.prismaModel.findMany(findManyArgs);
    }

    @Get('/detail')
    @UsePipes(new ZodValidationPipe(baseControllerDetailParamsSchema, 'query'))
    @Auth(permission.viewDetailPermission)
    @ApiIdParamNameQueries(model.idParamNames)
    async findOne(
      @Query()
      query: any,
    ) {
      return this.prismaModel.findUnique({
        where: this.getDetailWhere(query),
      });
    }

    @Post()
    @UsePipes(new ZodValidationPipe(createOrUpdateSchema))
    @Auth(permission.createPermission)
    @ApiBody({
      schema: {
        type: 'object',
        default: model.defaultSwaggerCreateOrUpdateBody,
      },
    })
    async createOne(
      @Body()
      body: any,
    ) {
      return this.prismaModel.create({
        data: body,
      });
    }

    @Put()
    @UsePipes(new ZodValidationPipe(createOrUpdateSchema))
    @UsePipes(new ZodValidationPipe(baseControllerDetailParamsSchema, 'query'))
    @Auth(permission.updatePermission)
    @ApiBody({
      schema: {
        type: 'object',
        default: model.defaultSwaggerCreateOrUpdateBody,
      },
    })
    @ApiIdParamNameQueries(model.idParamNames)
    async updateOne(
      @Body()
      body: any,
      @Query()
      query: any,
    ) {
      return this.prismaModel.update({
        where: this.getDetailWhere(query),
        data: body,
      });
    }

    @Delete()
    @UsePipes(new ZodValidationPipe(baseControllerDetailParamsSchema, 'query'))
    @Auth(permission.deletePermission)
    @ApiIdParamNameQueries(model.idParamNames)
    async deleteOne(
      @Query()
      query: any,
    ) {
      return this.prismaModel.delete({
        where: this.getDetailWhere(query),
      });
    }
  }

  return BaseController;
}
