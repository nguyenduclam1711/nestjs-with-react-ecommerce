import { z } from 'zod';

export const RolePermissionCreateOrUpdateSchema = z.object({
  roleCode: z.string(),
  permissionCode: z.string(),
});
