import { ApiProperty } from '@nestjs/swagger';

export type JwtPayload = {
  id: number;
};

export class JwtTokens {
  @ApiProperty()
  accessToken: string = '';
}
