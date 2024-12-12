import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseJsonStringPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') {
      throw new BadRequestException(
        "ParseJsonString haven't support types other than query",
      );
    }
    const dataName = metadata.data ?? 'query';
    if (typeof value !== 'string') {
      throw new BadRequestException(`${dataName} is not a string`);
    }
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return {};
    }
    try {
      const parsedValue = JSON.parse(trimmedValue);
      return parsedValue;
    } catch {
      throw new BadRequestException(`${dataName} is not a valid json string`);
    }
  }
}
