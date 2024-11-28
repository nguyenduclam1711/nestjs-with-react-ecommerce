import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    }
    return value;
  }
}
