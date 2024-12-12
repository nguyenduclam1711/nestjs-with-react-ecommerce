import { ApiProperty } from '@nestjs/swagger';

export class BaseControllerFindManyDto {
  @ApiProperty({
    type: 'object',
    properties: {},
  })
  where: any;
}
