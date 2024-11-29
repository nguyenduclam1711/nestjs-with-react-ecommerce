import { ApiProperty } from '@nestjs/swagger';
import { REGEX } from 'src/constants/regex';
import { z } from 'zod';

export const authRegisterBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(REGEX.password, {
      message:
        'Password must contain at least one number and one special character',
    }),
});

export type AuthRegisterBodySchema = z.infer<typeof authRegisterBodySchema>;

export class AuthRegisterBodyDto {
  @ApiProperty({
    example: 'test',
  })
  name: string;

  @ApiProperty({
    example: 'test@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: '@Abc1234',
  })
  password: string;
}

export class AuthRegisterResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdDate: Date;

  @ApiProperty()
  updatedDate: Date;
}

export const authLoginBodySchema = authRegisterBodySchema.pick({
  email: true,
  password: true,
});

export type AuthLoginBodySchema = z.infer<typeof authLoginBodySchema>;

export class AuthLoginBodyDto {
  @ApiProperty({
    example: 'test@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: '@Abc1234',
  })
  password: string;
}

export class AuthLoginResponse {
  @ApiProperty()
  accessToken: string;
}
