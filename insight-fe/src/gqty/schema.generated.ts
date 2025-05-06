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

export interface CreateEducatorProfileInput {
  staffId: Scalars["Float"]["input"];
}

export interface CreatePermissionGroupInput {
  description: Scalars["String"]["input"];
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

export interface CreateStudentProfileInput {
  schoolYear: Scalars["Float"]["input"];
  studentId: Scalars["Float"]["input"];
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
  userType: Scalars["String"]["input"];
}

export interface CreateUserWithProfileInput {
  addressLine1?: InputMaybe<Scalars["String"]["input"]>;
  addressLine2?: InputMaybe<Scalars["String"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  county?: InputMaybe<Scalars["String"]["input"]>;
  dateOfBirth?: InputMaybe<Scalars["DateTime"]["input"]>;
  educatorProfile?: InputMaybe<CreateEducatorProfileInput>;
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  postalCode?: InputMaybe<Scalars["String"]["input"]>;
  studentProfile?: InputMaybe<CreateStudentProfileInput>;
  userType: Scalars["String"]["input"];
}

export interface FindAllInput {
  /** Set to true to return all records, ignoring pagination values */
  all?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Maximum number of records to return */
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of records to skip */
  offset?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface FindOneByInput {
  column: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
}

export interface IdInput {
  id: Scalars["Int"]["input"];
}

export interface IdRequestDto {
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

export interface SubmitIdArrayByIdRequestDto {
  idArray: Array<Scalars["Int"]["input"]>;
  recordId: Scalars["Int"]["input"];
}

export interface UpdateEducatorProfileInput {
  id: Scalars["Int"]["input"];
  staffId?: InputMaybe<Scalars["Float"]["input"]>;
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

export interface UpdateStudentProfileInput {
  id: Scalars["Int"]["input"];
  schoolYear?: InputMaybe<Scalars["Float"]["input"]>;
  studentId?: InputMaybe<Scalars["Float"]["input"]>;
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
  publicId: Scalars["String"]["input"];
  userType: Scalars["String"]["input"];
}

export interface UpdateUserRolesFromArrayRequestDto {
  publicId: Scalars["String"]["input"];
  roleIds: Array<Scalars["Int"]["input"]>;
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
  CreateEducatorProfileInput: { staffId: { __type: "Float!" } },
  CreatePermissionGroupInput: {
    description: { __type: "String!" },
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
  CreateStudentProfileInput: {
    schoolYear: { __type: "Float!" },
    studentId: { __type: "Float!" },
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
    userType: { __type: "String!" },
  },
  CreateUserWithProfileInput: {
    addressLine1: { __type: "String" },
    addressLine2: { __type: "String" },
    city: { __type: "String" },
    country: { __type: "String" },
    county: { __type: "String" },
    dateOfBirth: { __type: "DateTime" },
    educatorProfile: { __type: "CreateEducatorProfileInput" },
    email: { __type: "String!" },
    firstName: { __type: "String!" },
    lastName: { __type: "String!" },
    password: { __type: "String!" },
    phoneNumber: { __type: "String" },
    postalCode: { __type: "String" },
    studentProfile: { __type: "CreateStudentProfileInput" },
    userType: { __type: "String!" },
  },
  EducatorProfileDto: {
    __typename: { __type: "String!" },
    createdAt: { __type: "DateTime!" },
    id: { __type: "ID!" },
    staffId: { __type: "Float!" },
    updatedAt: { __type: "DateTime!" },
  },
  FindAllInput: {
    all: { __type: "Boolean" },
    limit: { __type: "Int" },
    offset: { __type: "Int" },
  },
  FindOneByInput: {
    column: { __type: "String!" },
    value: { __type: "String!" },
  },
  IdInput: { id: { __type: "Int!" } },
  IdRequestDto: { id: { __type: "Int!" } },
  LoginRequest: {
    email: { __type: "String!" },
    password: { __type: "String!" },
  },
  LoginResponse: {
    __typename: { __type: "String!" },
    accessToken: { __type: "String!" },
    refreshToken: { __type: "String!" },
    userDetails: { __type: "UserDetails!" },
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
    description: { __type: "String!" },
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
    description: { __type: "String!" },
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
  StudentProfileDto: {
    __typename: { __type: "String!" },
    createdAt: { __type: "DateTime!" },
    id: { __type: "ID!" },
    schoolYear: { __type: "Float!" },
    studentId: { __type: "Float!" },
    updatedAt: { __type: "DateTime!" },
  },
  SubmitIdArrayByIdRequestDto: {
    idArray: { __type: "[Int!]!" },
    recordId: { __type: "Int!" },
  },
  UpdateEducatorProfileInput: {
    id: { __type: "Int!" },
    staffId: { __type: "Float" },
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
  UpdateStudentProfileInput: {
    id: { __type: "Int!" },
    schoolYear: { __type: "Float" },
    studentId: { __type: "Float" },
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
    publicId: { __type: "String!" },
    userType: { __type: "String!" },
  },
  UpdateUserRolesFromArrayRequestDto: {
    publicId: { __type: "String!" },
    roleIds: { __type: "[Int!]!" },
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
    educatorProfile: { __type: "EducatorProfileDto" },
    email: { __type: "String!" },
    firstName: { __type: "String!" },
    id: { __type: "ID!" },
    lastName: { __type: "String!" },
    phoneNumber: { __type: "String" },
    postalCode: { __type: "String" },
    publicId: { __type: "String!" },
    roles: { __type: "[Role!]" },
    studentProfile: { __type: "StudentProfileDto" },
    updatedAt: { __type: "DateTime!" },
    userType: { __type: "String!" },
  },
  UserDetails: {
    __typename: { __type: "String!" },
    permissions: { __type: "[String!]!" },
    publicId: { __type: "String!" },
  },
  UserPermissionsInput: { publicId: { __type: "String!" } },
  mutation: {
    __typename: { __type: "String!" },
    createEducatorProfile: {
      __type: "EducatorProfileDto!",
      __args: { data: "CreateEducatorProfileInput!" },
    },
    createPermission: {
      __type: "Permission!",
      __args: { data: "CreatePermissionInput!" },
    },
    createPermissionGroup: {
      __type: "PermissionGroup!",
      __args: { data: "CreatePermissionGroupInput!" },
    },
    createRole: { __type: "Role!", __args: { data: "CreateRoleInput!" } },
    createStudentProfile: {
      __type: "StudentProfileDto!",
      __args: { data: "CreateStudentProfileInput!" },
    },
    createUser: { __type: "User!", __args: { data: "CreateUserRequestDto!" } },
    createUserWithProfile: {
      __type: "User!",
      __args: { data: "CreateUserWithProfileInput!" },
    },
    deleteEducatorProfile: { __type: "Boolean!", __args: { data: "IdInput!" } },
    deletePermission: { __type: "Boolean!", __args: { data: "IdInput!" } },
    deletePermissionGroup: { __type: "Boolean!", __args: { data: "IdInput!" } },
    deleteRole: { __type: "Boolean!", __args: { data: "IdInput!" } },
    deleteStudentProfile: { __type: "Boolean!", __args: { data: "IdInput!" } },
    logUserInWithEmailAndPassword: {
      __type: "AuthTokens!",
      __args: { data: "LoginRequest!" },
    },
    refreshUsersTokens: {
      __type: "LoginResponse!",
      __args: { refreshToken: "String!" },
    },
    registerNewUserLocally: {
      __type: "User!",
      __args: { data: "CreateUserRequestDto!" },
    },
    removeUserByPublicId: {
      __type: "User!",
      __args: { data: "PublicIdRequestDto!" },
    },
    updateEducatorProfile: {
      __type: "EducatorProfileDto!",
      __args: { data: "UpdateEducatorProfileInput!" },
    },
    updatePermission: {
      __type: "Permission!",
      __args: { data: "UpdatePermissionInput!" },
    },
    updatePermissionGroup: {
      __type: "PermissionGroup!",
      __args: { data: "UpdatePermissionGroupInput!" },
    },
    updatePermissionGroupPermissionsFromArray: {
      __type: "PermissionGroup!",
      __args: { data: "SubmitIdArrayByIdRequestDto!" },
    },
    updatePermissionGroupsForRole: {
      __type: "Role!",
      __args: { data: "SubmitIdArrayByIdRequestDto!" },
    },
    updateRole: { __type: "Role!", __args: { data: "UpdateRoleInput!" } },
    updateStudentProfile: {
      __type: "StudentProfileDto!",
      __args: { data: "UpdateStudentProfileInput!" },
    },
    updateUserByPublicId: {
      __type: "User!",
      __args: { data: "UpdateUserRequestDto!", publicId: "String!" },
    },
    updateUserRolesFromArray: {
      __type: "User!",
      __args: { data: "UpdateUserRolesFromArrayRequestDto!" },
    },
  },
  query: {
    __typename: { __type: "String!" },
    getAllEducatorProfile: {
      __type: "[EducatorProfileDto!]!",
      __args: { data: "FindAllInput!" },
    },
    getAllPermission: {
      __type: "[Permission!]!",
      __args: { data: "FindAllInput!" },
    },
    getAllPermissionGroup: {
      __type: "[PermissionGroup!]!",
      __args: { data: "FindAllInput!" },
    },
    getAllRole: { __type: "[Role!]!", __args: { data: "FindAllInput!" } },
    getAllStudentProfile: {
      __type: "[StudentProfileDto!]!",
      __args: { data: "FindAllInput!" },
    },
    getAllUsers: {
      __type: "[User!]!",
      __args: { data: "PaginatedGetAllRequestDto!" },
    },
    getEducatorProfile: {
      __type: "EducatorProfileDto!",
      __args: { data: "IdInput!" },
    },
    getEducatorProfileBy: {
      __type: "EducatorProfileDto!",
      __args: { data: "FindOneByInput!" },
    },
    getPermission: { __type: "Permission!", __args: { data: "IdInput!" } },
    getPermissionBy: {
      __type: "Permission!",
      __args: { data: "FindOneByInput!" },
    },
    getPermissionGroup: {
      __type: "PermissionGroup!",
      __args: { data: "IdInput!" },
    },
    getPermissionGroupBy: {
      __type: "PermissionGroup!",
      __args: { data: "FindOneByInput!" },
    },
    getPermissionGroupsForRole: {
      __type: "[PermissionGroup!]!",
      __args: { data: "IdRequestDto!" },
    },
    getPermissionsForGroup: {
      __type: "[Permission!]!",
      __args: { data: "IdRequestDto!" },
    },
    getRole: { __type: "Role!", __args: { data: "IdInput!" } },
    getRoleBy: { __type: "Role!", __args: { data: "FindOneByInput!" } },
    getRolesForUser: {
      __type: "[Role!]!",
      __args: { data: "PublicIdRequestDto!" },
    },
    getStudentProfile: {
      __type: "StudentProfileDto!",
      __args: { data: "IdInput!" },
    },
    getStudentProfileBy: {
      __type: "StudentProfileDto!",
      __args: { data: "FindOneByInput!" },
    },
    getUserByPublicId: {
      __type: "User!",
      __args: { data: "PublicIdRequestDto!" },
    },
    getUsersRolesAndPermissions: {
      __type: "RolesPermissionsResponse!",
      __args: { data: "UserPermissionsInput!" },
    },
  },
  subscription: {},
} as const;

export interface AuthTokens {
  __typename?: "AuthTokens";
  accessToken: ScalarsEnums["String"];
  refreshToken: ScalarsEnums["String"];
}

export interface EducatorProfileDto {
  __typename?: "EducatorProfileDto";
  createdAt: ScalarsEnums["DateTime"];
  id: ScalarsEnums["ID"];
  staffId: ScalarsEnums["Float"];
  updatedAt: ScalarsEnums["DateTime"];
}

export interface LoginResponse {
  __typename?: "LoginResponse";
  accessToken: ScalarsEnums["String"];
  refreshToken: ScalarsEnums["String"];
  userDetails: UserDetails;
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
  description: ScalarsEnums["String"];
  id: ScalarsEnums["ID"];
  name: ScalarsEnums["String"];
  permissions?: Maybe<Array<Permission>>;
  roles?: Maybe<Array<Role>>;
  updatedAt: ScalarsEnums["DateTime"];
}

export interface Role {
  __typename?: "Role";
  createdAt: ScalarsEnums["DateTime"];
  description: ScalarsEnums["String"];
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

export interface StudentProfileDto {
  __typename?: "StudentProfileDto";
  createdAt: ScalarsEnums["DateTime"];
  id: ScalarsEnums["ID"];
  schoolYear: ScalarsEnums["Float"];
  studentId: ScalarsEnums["Float"];
  updatedAt: ScalarsEnums["DateTime"];
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
  educatorProfile?: Maybe<EducatorProfileDto>;
  email: ScalarsEnums["String"];
  firstName: ScalarsEnums["String"];
  id: ScalarsEnums["ID"];
  lastName: ScalarsEnums["String"];
  phoneNumber?: Maybe<ScalarsEnums["String"]>;
  postalCode?: Maybe<ScalarsEnums["String"]>;
  publicId: ScalarsEnums["String"];
  roles?: Maybe<Array<Role>>;
  studentProfile?: Maybe<StudentProfileDto>;
  updatedAt: ScalarsEnums["DateTime"];
  userType: ScalarsEnums["String"];
}

export interface UserDetails {
  __typename?: "UserDetails";
  permissions: Array<ScalarsEnums["String"]>;
  publicId: ScalarsEnums["String"];
}

export interface Mutation {
  __typename?: "Mutation";
  /**
   * Create one EducatorProfile
   */
  createEducatorProfile: (args: {
    data: CreateEducatorProfileInput;
  }) => EducatorProfileDto;
  /**
   * Create one Permission
   */
  createPermission: (args: { data: CreatePermissionInput }) => Permission;
  /**
   * Create one PermissionGroup
   */
  createPermissionGroup: (args: {
    data: CreatePermissionGroupInput;
  }) => PermissionGroup;
  /**
   * Create one Role
   */
  createRole: (args: { data: CreateRoleInput }) => Role;
  /**
   * Create one StudentProfile
   */
  createStudentProfile: (args: {
    data: CreateStudentProfileInput;
  }) => StudentProfileDto;
  createUser: (args: { data: CreateUserRequestDto }) => User;
  createUserWithProfile: (args: { data: CreateUserWithProfileInput }) => User;
  /**
   * Delete one EducatorProfile
   */
  deleteEducatorProfile: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
  /**
   * Delete one Permission
   */
  deletePermission: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
  /**
   * Delete one PermissionGroup
   */
  deletePermissionGroup: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
  /**
   * Delete one Role
   */
  deleteRole: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
  /**
   * Delete one StudentProfile
   */
  deleteStudentProfile: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
  logUserInWithEmailAndPassword: (args: { data: LoginRequest }) => AuthTokens;
  refreshUsersTokens: (args: {
    refreshToken: ScalarsEnums["String"];
  }) => LoginResponse;
  registerNewUserLocally: (args: { data: CreateUserRequestDto }) => User;
  removeUserByPublicId: (args: { data: PublicIdRequestDto }) => User;
  /**
   * Updates one EducatorProfile
   */
  updateEducatorProfile: (args: {
    data: UpdateEducatorProfileInput;
  }) => EducatorProfileDto;
  /**
   * Updates one Permission
   */
  updatePermission: (args: { data: UpdatePermissionInput }) => Permission;
  /**
   * Updates one PermissionGroup
   */
  updatePermissionGroup: (args: {
    data: UpdatePermissionGroupInput;
  }) => PermissionGroup;
  updatePermissionGroupPermissionsFromArray: (args: {
    data: SubmitIdArrayByIdRequestDto;
  }) => PermissionGroup;
  updatePermissionGroupsForRole: (args: {
    data: SubmitIdArrayByIdRequestDto;
  }) => Role;
  /**
   * Updates one Role
   */
  updateRole: (args: { data: UpdateRoleInput }) => Role;
  /**
   * Updates one StudentProfile
   */
  updateStudentProfile: (args: {
    data: UpdateStudentProfileInput;
  }) => StudentProfileDto;
  updateUserByPublicId: (args: {
    data: UpdateUserRequestDto;
    publicId: ScalarsEnums["String"];
  }) => User;
  updateUserRolesFromArray: (args: {
    data: UpdateUserRolesFromArrayRequestDto;
  }) => User;
}

export interface Query {
  __typename?: "Query";
  /**
   * Returns all EducatorProfile
   */
  getAllEducatorProfile: (args: {
    data: FindAllInput;
  }) => Array<EducatorProfileDto>;
  /**
   * Returns all Permission
   */
  getAllPermission: (args: { data: FindAllInput }) => Array<Permission>;
  /**
   * Returns all PermissionGroup
   */
  getAllPermissionGroup: (args: {
    data: FindAllInput;
  }) => Array<PermissionGroup>;
  /**
   * Returns all Role
   */
  getAllRole: (args: { data: FindAllInput }) => Array<Role>;
  /**
   * Returns all StudentProfile
   */
  getAllStudentProfile: (args: {
    data: FindAllInput;
  }) => Array<StudentProfileDto>;
  getAllUsers: (args: { data: PaginatedGetAllRequestDto }) => Array<User>;
  /**
   * Returns one EducatorProfile
   */
  getEducatorProfile: (args: { data: IdInput }) => EducatorProfileDto;
  /**
   * Returns one EducatorProfile by given conditions
   */
  getEducatorProfileBy: (args: { data: FindOneByInput }) => EducatorProfileDto;
  /**
   * Returns one Permission
   */
  getPermission: (args: { data: IdInput }) => Permission;
  /**
   * Returns one Permission by given conditions
   */
  getPermissionBy: (args: { data: FindOneByInput }) => Permission;
  /**
   * Returns one PermissionGroup
   */
  getPermissionGroup: (args: { data: IdInput }) => PermissionGroup;
  /**
   * Returns one PermissionGroup by given conditions
   */
  getPermissionGroupBy: (args: { data: FindOneByInput }) => PermissionGroup;
  getPermissionGroupsForRole: (args: {
    data: IdRequestDto;
  }) => Array<PermissionGroup>;
  getPermissionsForGroup: (args: { data: IdRequestDto }) => Array<Permission>;
  /**
   * Returns one Role
   */
  getRole: (args: { data: IdInput }) => Role;
  /**
   * Returns one Role by given conditions
   */
  getRoleBy: (args: { data: FindOneByInput }) => Role;
  getRolesForUser: (args: { data: PublicIdRequestDto }) => Array<Role>;
  /**
   * Returns one StudentProfile
   */
  getStudentProfile: (args: { data: IdInput }) => StudentProfileDto;
  /**
   * Returns one StudentProfile by given conditions
   */
  getStudentProfileBy: (args: { data: FindOneByInput }) => StudentProfileDto;
  getUserByPublicId: (args: { data: PublicIdRequestDto }) => User;
  getUsersRolesAndPermissions: (args: {
    data: UserPermissionsInput;
  }) => RolesPermissionsResponse;
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
