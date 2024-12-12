import { z } from 'zod';
import { jsonStringSchema, stringToIntSchema } from './common.schema';

export const BaseControllerFindManySchema = z.object({
  where: jsonStringSchema,
  include: jsonStringSchema,
  select: jsonStringSchema,
  orderBy: jsonStringSchema,
  distinct: jsonStringSchema,
  page: stringToIntSchema,
  size: stringToIntSchema,
});

export type BaseControllerFindManyType = z.infer<
  typeof BaseControllerFindManySchema
>;
