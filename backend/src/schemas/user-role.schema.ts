import { z } from 'zod';

export const UserRoleCreateOrUpdateSchema = z.object({
  userId: z.number(),
  roleCode: z.string(),
});
