import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      try {
        const parsedValue = this.schema.parse(value);
        return parsedValue;
      } catch (error) {
        console.log('error', error);
        // TODO: should do something like a global error handling here
        throw new BadRequestException('Validation failed');
      }
    }
    return value;
  }
}
