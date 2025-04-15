/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import { type ScalarsEnumsHash } from "gqty";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string };
}

export interface CreatePermissionGroupInput {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
}

export interface CreatePermissionInput {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
}

export interface CreateRoleInput {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
}

export interface CreateUserRequestDto {
  addressLine1?: InputMaybe<Scalars["String"]["input"]>;
  addressLine2?: InputMaybe<Scalars["String"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  county?: InputMaybe<Scalars["String"]["input"]>;
  dateOfBirth?: InputMaybe<Scalars["DateTime"]["input"]>;
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  postalCode?: InputMaybe<Scalars["String"]["input"]>;
}

export interface FindAllInput {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface FindOneByInput {
  column: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
}

export interface IdInput {
  id: Scalars["Int"]["input"];
}

export interface LoginRequest {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
}

export interface PaginatedGetAllRequestDto {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface PublicIdRequestDto {
  publicId: Scalars["String"]["input"];
}

export interface UpdatePermissionGroupInput {
  description?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["Int"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
}

export interface UpdatePermissionInput {
  description?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["Int"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
}

export interface UpdateRoleInput {
  description?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["Int"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
}

export interface UpdateUserRequestDto {
  addressLine1?: InputMaybe<Scalars["String"]["input"]>;
  addressLine2?: InputMaybe<Scalars["String"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  county?: InputMaybe<Scalars["String"]["input"]>;
  dateOfBirth?: InputMaybe<Scalars["DateTime"]["input"]>;
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  postalCode?: InputMaybe<Scalars["String"]["input"]>;
}

export interface UserPermissionsInput {
  publicId: Scalars["String"]["input"];
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  Boolean: true,
  DateTime: true,
  Float: true,
  ID: true,
  Int: true,
  String: true,
};
export const generatedSchema = {
  AuthTokens: {
    __typename: { __type: "String!" },
    accessToken: { __type: "String!" },
    refreshToken: { __type: "String!" },
  },
  CreatePermissionGroupInput: {
    description: { __type: "String" },
    name: { __type: "String!" },
  },
  CreatePermissionInput: {
    description: { __type: "String" },
    name: { __type: "String!" },
  },
  CreateRoleInput: {
    description: { __type: "String" },
    name: { __type: "String!" },
  },
  CreateUserRequestDto: {
    addressLine1: { __type: "String" },
    addressLine2: { __type: "String" },
    city: { __type: "String" },
    country: { __type: "String" },
    county: { __type: "String" },
    dateOfBirth: { __type: "DateTime" },
    email: { __type: "String!" },
    firstName: { __type: "String!" },
    lastName: { __type: "String!" },
    password: { __type: "String!" },
    phoneNumber: { __type: "String" },
    postalCode: { __type: "String" },
  },
  FindAllInput: { limit: { __type: "Int" }, offset: { __type: "Int" } },
  FindOneByInput: {
    column: { __type: "String!" },
    value: { __type: "String!" },
  },
  IdInput: { id: { __type: "Int!" } },
  LoginRequest: {
    email: { __type: "String!" },
    password: { __type: "String!" },
  },
  PaginatedGetAllRequestDto: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
  },
  Permission: {
    __typename: { __type: "String!" },
    createdAt: { __type: "DateTime!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    name: { __type: "String!" },
    permissionGroups: { __type: "[PermissionGroup!]" },
    roles: { __type: "[Role!]" },
    updatedAt: { __type: "DateTime!" },
  },
  PermissionDTO: {
    __typename: { __type: "String!" },
    createdAt: { __type: "DateTime!" },
    id: { __type: "Float!" },
    name: { __type: "String!" },
    updatedAt: { __type: "DateTime!" },
  },
  PermissionGroup: {
    __typename: { __type: "String!" },
    createdAt: { __type: "DateTime!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    name: { __type: "String!" },
    permissions: { __type: "[Permission!]" },
    roles: { __type: "[Role!]" },
    updatedAt: { __type: "DateTime!" },
  },
  PublicIdRequestDto: { publicId: { __type: "String!" } },
  Role: {
    __typename: { __type: "String!" },
    createdAt: { __type: "DateTime!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    name: { __type: "String!" },
    permissionGroups: { __type: "[PermissionGroup!]" },
    permissions: { __type: "[Permission!]" },
    updatedAt: { __type: "DateTime!" },
  },
  RoleDTO: {
    __typename: { __type: "String!" },
    createdAt: { __type: "DateTime!" },
    id: { __type: "Float!" },
    name: { __type: "String!" },
    updatedAt: { __type: "DateTime!" },
  },
  RolesPermissionsResponse: {
    __typename: { __type: "String!" },
    permissions: { __type: "[PermissionDTO!]!" },
    roles: { __type: "[RoleDTO!]!" },
  },
  UpdatePermissionGroupInput: {
    description: { __type: "String" },
    id: { __type: "Int!" },
    name: { __type: "String" },
  },
  UpdatePermissionInput: {
    description: { __type: "String" },
    id: { __type: "Int!" },
    name: { __type: "String" },
  },
  UpdateRoleInput: {
    description: { __type: "String" },
    id: { __type: "Int!" },
    name: { __type: "String" },
  },
  UpdateUserRequestDto: {
    addressLine1: { __type: "String" },
    addressLine2: { __type: "String" },
    city: { __type: "String" },
    country: { __type: "String" },
    county: { __type: "String" },
    dateOfBirth: { __type: "DateTime" },
    email: { __type: "String!" },
    firstName: { __type: "String!" },
    lastName: { __type: "String!" },
    phoneNumber: { __type: "String" },
    postalCode: { __type: "String" },
  },
  User: {
    __typename: { __type: "String!" },
    addressLine1: { __type: "String" },
    addressLine2: { __type: "String" },
    city: { __type: "String" },
    country: { __type: "String" },
    county: { __type: "String" },
    createdAt: { __type: "DateTime!" },
    dateOfBirth: { __type: "DateTime" },
    email: { __type: "String!" },
    firstName: { __type: "String!" },
    id: { __type: "ID!" },
    lastName: { __type: "String!" },
    phoneNumber: { __type: "String" },
    postalCode: { __type: "String" },
    publicId: { __type: "String!" },
    roles: { __type: "[Role!]" },
    updatedAt: { __type: "DateTime!" },
  },
  UserPermissionsInput: { publicId: { __type: "String!" } },
  mutation: {
    __typename: { __type: "String!" },
    addPermissionGroupsToRole: {
      __type: "Role!",
      __args: { groupIds: "[Int!]!", roleId: "Int!" },
    },
    addPermissionsToGroup: {
      __type: "PermissionGroup!",
      __args: { groupId: "Int!", permissionIds: "[Int!]!" },
    },
    addPermissionsToRole: {
      __type: "Role!",
      __args: { permissionIds: "[Int!]!", roleId: "Int!" },
    },
    addRolesToUser: {
      __type: "User!",
      __args: { publicId: "String!", roleIds: "[Int!]!" },
    },
    createPermission: {
      __type: "Permission!",
      __args: { data: "CreatePermissionInput!" },
    },
    createRole: { __type: "Role!", __args: { data: "CreateRoleInput!" } },
    createUser: { __type: "User!", __args: { data: "CreateUserRequestDto!" } },
    createpermissionGroup: {
      __type: "PermissionGroup!",
      __args: { data: "CreatePermissionGroupInput!" },
    },
    deletePermission: { __type: "Boolean!", __args: { data: "IdInput!" } },
    deleteRole: { __type: "Boolean!", __args: { data: "IdInput!" } },
    deletepermissionGroup: { __type: "Boolean!", __args: { data: "IdInput!" } },
    logUserInWithEmailAndPassword: {
      __type: "AuthTokens!",
      __args: { data: "LoginRequest!" },
    },
    refreshUsersTokens: {
      __type: "AuthTokens!",
      __args: { refreshToken: "String!" },
    },
    registerNewUserLocally: {
      __type: "User!",
      __args: { data: "CreateUserRequestDto!" },
    },
    removePermissionsFromGroup: {
      __type: "PermissionGroup!",
      __args: { groupId: "Int!", permissionIds: "[Int!]!" },
    },
    removePermissionsFromRole: {
      __type: "Role!",
      __args: { permissionIds: "[Int!]!", roleId: "Int!" },
    },
    removeRolesFromUser: {
      __type: "User!",
      __args: { publicId: "String!", roleIds: "[Int!]!" },
    },
    removeUserByPublicId: {
      __type: "User!",
      __args: { data: "PublicIdRequestDto!" },
    },
    updatePermission: {
      __type: "Permission!",
      __args: { data: "UpdatePermissionInput!" },
    },
    updateRole: { __type: "Role!", __args: { data: "UpdateRoleInput!" } },
    updateUserByPublicId: {
      __type: "User!",
      __args: { data: "UpdateUserRequestDto!", publicId: "String!" },
    },
    updatepermissionGroup: {
      __type: "PermissionGroup!",
      __args: { data: "UpdatePermissionGroupInput!" },
    },
  },
  query: {
    __typename: { __type: "String!" },
    getAllPermission: {
      __type: "[Permission!]!",
      __args: { data: "FindAllInput!" },
    },
    getAllRole: { __type: "[Role!]!", __args: { data: "FindAllInput!" } },
    getAllUsers: {
      __type: "[User!]!",
      __args: { data: "PaginatedGetAllRequestDto!" },
    },
    getAllpermissionGroup: {
      __type: "[PermissionGroup!]!",
      __args: { data: "FindAllInput!" },
    },
    getPermission: { __type: "Permission!", __args: { data: "IdInput!" } },
    getPermissionBy: {
      __type: "Permission!",
      __args: { data: "FindOneByInput!" },
    },
    getRole: { __type: "Role!", __args: { data: "IdInput!" } },
    getRoleBy: { __type: "Role!", __args: { data: "FindOneByInput!" } },
    getRolesForUser: {
      __type: "[Role!]!",
      __args: { data: "PublicIdRequestDto!" },
    },
    getUserByPublicId: {
      __type: "User!",
      __args: { data: "PublicIdRequestDto!" },
    },
    getUsersRolesAndPermissions: {
      __type: "RolesPermissionsResponse!",
      __args: { data: "UserPermissionsInput!" },
    },
    getpermissionGroup: {
      __type: "PermissionGroup!",
      __args: { data: "IdInput!" },
    },
    getpermissionGroupBy: {
      __type: "PermissionGroup!",
      __args: { data: "FindOneByInput!" },
    },
  },
  subscription: {},
} as const;

export interface AuthTokens {
  __typename?: "AuthTokens";
  accessToken: ScalarsEnums["String"];
  refreshToken: ScalarsEnums["String"];
}

export interface Permission {
  __typename?: "Permission";
  createdAt: ScalarsEnums["DateTime"];
  description?: Maybe<ScalarsEnums["String"]>;
  id: ScalarsEnums["ID"];
  name: ScalarsEnums["String"];
  permissionGroups?: Maybe<Array<PermissionGroup>>;
  roles?: Maybe<Array<Role>>;
  updatedAt: ScalarsEnums["DateTime"];
}

export interface PermissionDTO {
  __typename?: "PermissionDTO";
  createdAt: ScalarsEnums["DateTime"];
  id: ScalarsEnums["Float"];
  name: ScalarsEnums["String"];
  updatedAt: ScalarsEnums["DateTime"];
}

export interface PermissionGroup {
  __typename?: "PermissionGroup";
  createdAt: ScalarsEnums["DateTime"];
  description?: Maybe<ScalarsEnums["String"]>;
  id: ScalarsEnums["ID"];
  name: ScalarsEnums["String"];
  permissions?: Maybe<Array<Permission>>;
  roles?: Maybe<Array<Role>>;
  updatedAt: ScalarsEnums["DateTime"];
}

export interface Role {
  __typename?: "Role";
  createdAt: ScalarsEnums["DateTime"];
  description?: Maybe<ScalarsEnums["String"]>;
  id: ScalarsEnums["ID"];
  name: ScalarsEnums["String"];
  permissionGroups?: Maybe<Array<PermissionGroup>>;
  permissions?: Maybe<Array<Permission>>;
  updatedAt: ScalarsEnums["DateTime"];
}

export interface RoleDTO {
  __typename?: "RoleDTO";
  createdAt: ScalarsEnums["DateTime"];
  id: ScalarsEnums["Float"];
  name: ScalarsEnums["String"];
  updatedAt: ScalarsEnums["DateTime"];
}

export interface RolesPermissionsResponse {
  __typename?: "RolesPermissionsResponse";
  permissions: Array<PermissionDTO>;
  roles: Array<RoleDTO>;
}

export interface User {
  __typename?: "User";
  addressLine1?: Maybe<ScalarsEnums["String"]>;
  addressLine2?: Maybe<ScalarsEnums["String"]>;
  city?: Maybe<ScalarsEnums["String"]>;
  country?: Maybe<ScalarsEnums["String"]>;
  county?: Maybe<ScalarsEnums["String"]>;
  createdAt: ScalarsEnums["DateTime"];
  dateOfBirth?: Maybe<ScalarsEnums["DateTime"]>;
  email: ScalarsEnums["String"];
  firstName: ScalarsEnums["String"];
  id: ScalarsEnums["ID"];
  lastName: ScalarsEnums["String"];
  phoneNumber?: Maybe<ScalarsEnums["String"]>;
  postalCode?: Maybe<ScalarsEnums["String"]>;
  publicId: ScalarsEnums["String"];
  roles?: Maybe<Array<Role>>;
  updatedAt: ScalarsEnums["DateTime"];
}

export interface Mutation {
  __typename?: "Mutation";
  addPermissionGroupsToRole: (args: {
    groupIds: Array<ScalarsEnums["Int"]>;
    roleId: ScalarsEnums["Int"];
  }) => Role;
  addPermissionsToGroup: (args: {
    groupId: ScalarsEnums["Int"];
    permissionIds: Array<ScalarsEnums["Int"]>;
  }) => PermissionGroup;
  addPermissionsToRole: (args: {
    permissionIds: Array<ScalarsEnums["Int"]>;
    roleId: ScalarsEnums["Int"];
  }) => Role;
  addRolesToUser: (args: {
    publicId: ScalarsEnums["String"];
    roleIds: Array<ScalarsEnums["Int"]>;
  }) => User;
  /**
   * Create one Permission
   */
  createPermission: (args: { data: CreatePermissionInput }) => Permission;
  /**
   * Create one Role
   */
  createRole: (args: { data: CreateRoleInput }) => Role;
  createUser: (args: { data: CreateUserRequestDto }) => User;
  /**
   * Create one permissionGroup
   */
  createpermissionGroup: (args: {
    data: CreatePermissionGroupInput;
  }) => PermissionGroup;
  /**
   * Delete one Permission
   */
  deletePermission: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
  /**
   * Delete one Role
   */
  deleteRole: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
  /**
   * Delete one permissionGroup
   */
  deletepermissionGroup: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
  logUserInWithEmailAndPassword: (args: { data: LoginRequest }) => AuthTokens;
  refreshUsersTokens: (args: {
    refreshToken: ScalarsEnums["String"];
  }) => AuthTokens;
  registerNewUserLocally: (args: { data: CreateUserRequestDto }) => User;
  removePermissionsFromGroup: (args: {
    groupId: ScalarsEnums["Int"];
    permissionIds: Array<ScalarsEnums["Int"]>;
  }) => PermissionGroup;
  removePermissionsFromRole: (args: {
    permissionIds: Array<ScalarsEnums["Int"]>;
    roleId: ScalarsEnums["Int"];
  }) => Role;
  removeRolesFromUser: (args: {
    publicId: ScalarsEnums["String"];
    roleIds: Array<ScalarsEnums["Int"]>;
  }) => User;
  removeUserByPublicId: (args: { data: PublicIdRequestDto }) => User;
  /**
   * Updates one Permission
   */
  updatePermission: (args: { data: UpdatePermissionInput }) => Permission;
  /**
   * Updates one Role
   */
  updateRole: (args: { data: UpdateRoleInput }) => Role;
  updateUserByPublicId: (args: {
    data: UpdateUserRequestDto;
    publicId: ScalarsEnums["String"];
  }) => User;
  /**
   * Updates one permissionGroup
   */
  updatepermissionGroup: (args: {
    data: UpdatePermissionGroupInput;
  }) => PermissionGroup;
}

export interface Query {
  __typename?: "Query";
  /**
   * Returns all Permission
   */
  getAllPermission: (args: { data: FindAllInput }) => Array<Permission>;
  /**
   * Returns all Role
   */
  getAllRole: (args: { data: FindAllInput }) => Array<Role>;
  getAllUsers: (args: { data: PaginatedGetAllRequestDto }) => Array<User>;
  /**
   * Returns all permissionGroup
   */
  getAllpermissionGroup: (args: {
    data: FindAllInput;
  }) => Array<PermissionGroup>;
  /**
   * Returns one Permission
   */
  getPermission: (args: { data: IdInput }) => Permission;
  /**
   * Returns one Permission by given conditions
   */
  getPermissionBy: (args: { data: FindOneByInput }) => Permission;
  /**
   * Returns one Role
   */
  getRole: (args: { data: IdInput }) => Role;
  /**
   * Returns one Role by given conditions
   */
  getRoleBy: (args: { data: FindOneByInput }) => Role;
  getRolesForUser: (args: { data: PublicIdRequestDto }) => Array<Role>;
  getUserByPublicId: (args: { data: PublicIdRequestDto }) => User;
  getUsersRolesAndPermissions: (args: {
    data: UserPermissionsInput;
  }) => RolesPermissionsResponse;
  /**
   * Returns one permissionGroup
   */
  getpermissionGroup: (args: { data: IdInput }) => PermissionGroup;
  /**
   * Returns one permissionGroup by given conditions
   */
  getpermissionGroupBy: (args: { data: FindOneByInput }) => PermissionGroup;
}

export interface Subscription {
  __typename?: "Subscription";
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}

export type ScalarsEnums = {
  [Key in keyof Scalars]: Scalars[Key] extends { output: unknown }
    ? Scalars[Key]["output"]
    : never;
} & {};
