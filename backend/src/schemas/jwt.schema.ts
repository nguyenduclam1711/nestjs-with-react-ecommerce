import { ApiProperty } from '@nestjs/swagger';

export class JwtTokens {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
