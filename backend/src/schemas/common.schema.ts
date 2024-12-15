import { z } from 'zod';

export const jsonStringSchema = z
  .optional(z.string())
  .transform((value, ctx): undefined | Record<string, any> => {
    if (value === undefined) {
      return undefined;
    }
    try {
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        return undefined;
      }
      const parsedValue = JSON.parse(trimmedValue);
      return parsedValue;
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Not a valid JSOn string',
      });
      return z.NEVER;
    }
  });

export const stringToIntSchema = z
  .optional(z.string())
  .transform((value, ctx): undefined | number => {
    if (value === undefined) {
      return value;
    }
    const num = parseInt(value);
    if (isNaN(num)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cannot parse this to number',
      });
      return z.NEVER;
    }
    return num;
  });
