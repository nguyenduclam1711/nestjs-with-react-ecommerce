import { REGEX } from 'src/constants/regex';
import { z } from 'zod';

export const UserCredentialCreateOrUpdateSchema = z.object({
  userId: z.number(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(REGEX.password, {
      message:
        'Password must contain at least one number and one special character',
    }),
});
