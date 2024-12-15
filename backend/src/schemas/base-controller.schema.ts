import { z } from 'zod';
import { jsonStringSchema, stringToIntSchema } from './common.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PAGINATION_DEFAULT_PAGE_SIZE } from 'src/constants/pagination';
import { MODEL, MODEL_DEFAULT_ID_PARAM_NAMES } from 'src/constants/model';

export const BaseControllerFindManySchema = z.object({
  where: jsonStringSchema,
  include: jsonStringSchema,
  select: jsonStringSchema,
  orderBy: jsonStringSchema,
  distinct: jsonStringSchema,
  page: stringToIntSchema,
  size: stringToIntSchema,
});

export class BaseControllerFindManyDto {
  @ApiPropertyOptional({
    type: 'string',
    description: 'JSON string',
  })
  where: string = '';

  @ApiPropertyOptional({
    type: 'string',
    description: 'JSON string',
  })
  include: string = '';

  @ApiPropertyOptional({
    type: 'string',
    description: 'JSON string',
  })
  select: string = '';

  @ApiPropertyOptional({
    type: 'string',
    description: 'JSON string',
  })
  orderBy: string = '';

  @ApiPropertyOptional({
    type: 'string',
    description: 'JSON string',
  })
  distinct: string = '';

  @ApiPropertyOptional({
    type: 'string',
    default: '1',
    description: 'Number string',
  })
  page: string = '';

  @ApiPropertyOptional({
    type: 'string',
    default: PAGINATION_DEFAULT_PAGE_SIZE.toString(),
    description: 'Number string',
  })
  size: string = '';
}

export const getBaseControllerDetailParamsSchema = (
  modelField: keyof typeof MODEL,
) => {
  const idParamNames =
    MODEL[modelField].idParamNames ?? MODEL_DEFAULT_ID_PARAM_NAMES;
  const zObject = {};

  idParamNames.forEach((paramName) => {
    if (paramName.type === 'number') {
      zObject[paramName.name] = stringToIntSchema;
    } else {
      zObject[paramName.name] = z.string();
    }
  });
  return z.object(zObject);
};
