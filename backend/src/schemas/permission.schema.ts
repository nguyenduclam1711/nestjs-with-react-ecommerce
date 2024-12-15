import { z } from 'zod';

export const PERMISSION_TYPE = {
  CUSTOM: 'CUSTOM',
  DEFAULT: 'DEFAULT',
} as const;

export type ModelPermission = {
  viewPermission: string;
  viewDetailPermission: string;
  createPermission: string;
  updatePermission: string;
  deletePermission: string;
};

export const PermissionCreateOrUpdateBodySchema = z.object({
  name: z.string(),
  code: z.string(),
  type: z.enum([PERMISSION_TYPE.DEFAULT, PERMISSION_TYPE.CUSTOM]),
});
