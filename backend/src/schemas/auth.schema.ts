import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { UserCreateOrUpdateSchema } from './user.schema';
import { UserCredentialCreateOrUpdateSchema } from './user-crendential.schema';

export const authRegisterBodySchema = z
  .object({})
  .merge(
    UserCreateOrUpdateSchema.pick({
      name: true,
      email: true,
    }),
  )
  .merge(
    UserCredentialCreateOrUpdateSchema.pick({
      password: true,
    }),
  );

export class AuthRegisterBodyDto {
  @ApiProperty({
    example: 'test',
  })
  name: string = '';

  @ApiProperty({
    example: 'test@gmail.com',
  })
  email: string = '';

  @ApiProperty({
    example: '@Abc1234',
  })
  password: string = '';
}

export class AuthRegisterResponse {
  @ApiProperty()
  id: number = 0;

  @ApiProperty()
  name: string = '';

  @ApiProperty()
  email: string = '';

  @ApiProperty()
  createdDate: Date = new Date();

  @ApiProperty()
  updatedDate: Date = new Date();
}

export const authLoginBodySchema = authRegisterBodySchema.pick({
  email: true,
  password: true,
});

export class AuthLoginBodyDto {
  @ApiProperty({
    example: 'test@gmail.com',
  })
  email: string = '';

  @ApiProperty({
    example: '@Abc1234',
  })
  password: string = '';
}

export const authRefreshBodySchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
});

export class AuthRefreshBodyDto {
  @ApiProperty()
  refreshToken: string = '';
}
