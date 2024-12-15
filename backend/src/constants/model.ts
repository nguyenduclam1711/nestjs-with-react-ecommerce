import {
  PERMISSION_TYPE,
  PermissionCreateOrUpdateBodySchema,
} from 'src/schemas/permission.schema';
import { RolePermissionCreateOrUpdateSchema } from 'src/schemas/role-permission.schema';
import { RoleCreateOrUpdateSchema } from 'src/schemas/role.schema';
import { UserCredentialCreateOrUpdateSchema } from 'src/schemas/user-crendential.schema';
import { UserRoleCreateOrUpdateSchema } from 'src/schemas/user-role.schema';
import { UserCreateOrUpdateSchema } from 'src/schemas/user.schema';
import { ZodSchema } from 'zod';

export type IdParamNames = {
  name: string;
  type: 'number' | 'string';
}[];

export const MODEL_DEFAULT_ID_PARAM_NAMES: IdParamNames = [
  {
    name: 'id',
    type: 'number',
  },
];

export const MODEL: {
  [modelField: string]: {
    modelName: string;
    idParamNames?: IdParamNames;
    createOrUpdateBodySchema: ZodSchema;
    defaultSwaggerCreateOrUpdateBody?: any;
  };
} = {
  USER: {
    modelName: 'User',
    createOrUpdateBodySchema: UserCreateOrUpdateSchema,
    defaultSwaggerCreateOrUpdateBody: {
      name: '',
      email: '',
    },
  },
  USER_CREDENTIAL: {
    modelName: 'UserCredential',
    createOrUpdateBodySchema: UserCredentialCreateOrUpdateSchema,
    defaultSwaggerCreateOrUpdateBody: {
      userId: 0,
      password: '',
    },
  },
  PERMISSION: {
    modelName: 'Permission',
    createOrUpdateBodySchema: PermissionCreateOrUpdateBodySchema,
    defaultSwaggerCreateOrUpdateBody: {
      name: '',
      code: '',
      type: PERMISSION_TYPE.DEFAULT,
    },
  },
  ROLE: {
    modelName: 'Role',
    createOrUpdateBodySchema: RoleCreateOrUpdateSchema,
    defaultSwaggerCreateOrUpdateBody: {
      name: '',
      code: '',
    },
  },
  ROLE_PERMISSION: {
    modelName: 'RolePermission',
    createOrUpdateBodySchema: RolePermissionCreateOrUpdateSchema,
    idParamNames: [
      {
        name: 'roleCode',
        type: 'string',
      },
      {
        name: 'permissionCode',
        type: 'string',
      },
    ],
    defaultSwaggerCreateOrUpdateBody: {
      roleCode: '',
      permissionCode: '',
    },
  },
  USER_ROLE: {
    modelName: 'UserRole',
    createOrUpdateBodySchema: UserRoleCreateOrUpdateSchema,
    idParamNames: [
      {
        name: 'userId',
        type: 'number',
      },
      {
        name: 'roleCode',
        type: 'string',
      },
    ],
    defaultSwaggerCreateOrUpdateBody: {
      userId: 0,
      roleCode: '',
    },
  },
};
