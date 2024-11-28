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

export const authLoginBodySchema = authRegisterBodySchema.pick({
  email: true,
  password: true,
});

export type AuthLoginBodySchema = z.infer<typeof authLoginBodySchema>;
