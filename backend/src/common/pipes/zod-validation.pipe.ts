import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  private type: ArgumentMetadata['type'] = 'body';

  constructor(
    private schema: ZodSchema,
    type?: ArgumentMetadata['type'],
  ) {
    if (type) {
      this.type = type;
    }
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === this.type) {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    }
    return value;
  }
}
