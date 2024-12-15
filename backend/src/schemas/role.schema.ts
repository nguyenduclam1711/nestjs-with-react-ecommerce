import { z } from 'zod';

export const RoleCreateOrUpdateSchema = z.object({
  name: z.string(),
  code: z.string(),
});
