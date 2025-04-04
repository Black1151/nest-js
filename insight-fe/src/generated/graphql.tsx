import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AuthTokens = {
  __typename?: 'AuthTokens';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type CreatePermissionGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreatePermissionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserDto = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  county?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
};

export type FindAllInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type FindOneByInput = {
  column: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type IdInput = {
  id: Scalars['Int']['input'];
};

export type LoginRequest = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addPermissionGroupsToRole: Role;
  addPermissionsToGroup: PermissionGroup;
  addPermissionsToRole: Role;
  addRolesToUser: User;
  createUser: User;
  login: AuthTokens;
  /** Create one permission */
  permissionCreate: Permission;
  /** Create one permissionGroup */
  permissionGroupCreate: PermissionGroup;
  /** Remove one permissionGroup */
  permissionGroupRemove: Scalars['Boolean']['output'];
  /** Update one permissionGroup */
  permissionGroupUpdate: PermissionGroup;
  /** Remove one permission */
  permissionRemove: Scalars['Boolean']['output'];
  /** Update one permission */
  permissionUpdate: Permission;
  refresh: AuthTokens;
  register: User;
  removePermissionGroupsFromRole: Role;
  removePermissionsFromGroup: PermissionGroup;
  removePermissionsFromRole: Role;
  removeRolesFromUser: User;
  removeUser: Scalars['Boolean']['output'];
  /** Create one role */
  roleCreate: Role;
  /** Remove one role */
  roleRemove: Scalars['Boolean']['output'];
  /** Update one role */
  roleUpdate: Role;
  updateUserByPublicId: User;
};


export type MutationAddPermissionGroupsToRoleArgs = {
  groupIds: Array<Scalars['Int']['input']>;
  roleId: Scalars['Int']['input'];
};


export type MutationAddPermissionsToGroupArgs = {
  groupId: Scalars['Int']['input'];
  permissionIds: Array<Scalars['Int']['input']>;
};


export type MutationAddPermissionsToRoleArgs = {
  permissionIds: Array<Scalars['Int']['input']>;
  roleId: Scalars['Int']['input'];
};


export type MutationAddRolesToUserArgs = {
  publicId: Scalars['String']['input'];
  roleIds: Array<Scalars['Int']['input']>;
};


export type MutationCreateUserArgs = {
  data: CreateUserDto;
};


export type MutationLoginArgs = {
  data: LoginRequest;
};


export type MutationPermissionCreateArgs = {
  data: CreatePermissionInput;
};


export type MutationPermissionGroupCreateArgs = {
  data: CreatePermissionGroupInput;
};


export type MutationPermissionGroupRemoveArgs = {
  data: IdInput;
};


export type MutationPermissionGroupUpdateArgs = {
  data: UpdatePermissionGroupInput;
};


export type MutationPermissionRemoveArgs = {
  data: IdInput;
};


export type MutationPermissionUpdateArgs = {
  data: UpdatePermissionInput;
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  data: CreateUserDto;
};


export type MutationRemovePermissionGroupsFromRoleArgs = {
  groupIds: Array<Scalars['Int']['input']>;
  roleId: Scalars['Int']['input'];
};


export type MutationRemovePermissionsFromGroupArgs = {
  groupId: Scalars['Int']['input'];
  permissionIds: Array<Scalars['Int']['input']>;
};


export type MutationRemovePermissionsFromRoleArgs = {
  permissionIds: Array<Scalars['Int']['input']>;
  roleId: Scalars['Int']['input'];
};


export type MutationRemoveRolesFromUserArgs = {
  publicId: Scalars['String']['input'];
  roleIds: Array<Scalars['Int']['input']>;
};


export type MutationRemoveUserArgs = {
  publicId: Scalars['String']['input'];
};


export type MutationRoleCreateArgs = {
  data: CreateRoleInput;
};


export type MutationRoleRemoveArgs = {
  data: IdInput;
};


export type MutationRoleUpdateArgs = {
  data: UpdateRoleInput;
};


export type MutationUpdateUserByPublicIdArgs = {
  data: UpdateUserDto;
  publicId: Scalars['String']['input'];
};

export type Permission = {
  __typename?: 'Permission';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissionGroups?: Maybe<Array<PermissionGroup>>;
  roles?: Maybe<Array<Role>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PermissionDto = {
  __typename?: 'PermissionDTO';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PermissionGroup = {
  __typename?: 'PermissionGroup';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<Permission>>;
  roles?: Maybe<Array<Role>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  findUserByPublicId: User;
  /** Find all permission */
  permissionFindAll: Array<Permission>;
  /** Find one permission */
  permissionFindOne: Permission;
  /** Find one permission by given conditions */
  permissionFindOneBy: Permission;
  /** Find all permissionGroup */
  permissionGroupFindAll: Array<PermissionGroup>;
  /** Find one permissionGroup */
  permissionGroupFindOne: PermissionGroup;
  /** Find one permissionGroup by given conditions */
  permissionGroupFindOneBy: PermissionGroup;
  /** Find all role */
  roleFindAll: Array<Role>;
  /** Find one role */
  roleFindOne: Role;
  /** Find one role by given conditions */
  roleFindOneBy: Role;
  userPermissions: RolesPermissionsResponse;
  usersFindAll: Array<User>;
};


export type QueryFindUserByPublicIdArgs = {
  publicId: Scalars['String']['input'];
};


export type QueryPermissionFindAllArgs = {
  data: FindAllInput;
};


export type QueryPermissionFindOneArgs = {
  data: IdInput;
};


export type QueryPermissionFindOneByArgs = {
  data: FindOneByInput;
};


export type QueryPermissionGroupFindAllArgs = {
  data: FindAllInput;
};


export type QueryPermissionGroupFindOneArgs = {
  data: IdInput;
};


export type QueryPermissionGroupFindOneByArgs = {
  data: FindOneByInput;
};


export type QueryRoleFindAllArgs = {
  data: FindAllInput;
};


export type QueryRoleFindOneArgs = {
  data: IdInput;
};


export type QueryRoleFindOneByArgs = {
  data: FindOneByInput;
};


export type QueryUserPermissionsArgs = {
  data: UserPermissionsInput;
};


export type QueryUsersFindAllArgs = {
  data: FindAllInput;
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissionGroups?: Maybe<Array<PermissionGroup>>;
  permissions?: Maybe<Array<Permission>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type RoleDto = {
  __typename?: 'RoleDTO';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RolesPermissionsResponse = {
  __typename?: 'RolesPermissionsResponse';
  permissions: Array<PermissionDto>;
  roles: Array<RoleDto>;
};

export type UpdatePermissionGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePermissionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserDto = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  county?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  publicId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  addressLine1?: Maybe<Scalars['String']['output']>;
  addressLine2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  county?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  publicId: Scalars['String']['output'];
  roles?: Maybe<Array<Role>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserPermissionsInput = {
  publicId: Scalars['String']['input'];
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthTokens', accessToken: string, refreshToken: string } };

export type RefreshMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshMutation = { __typename?: 'Mutation', refresh: { __typename?: 'AuthTokens', accessToken: string, refreshToken: string } };

export type CreatePermissionMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
}>;


export type CreatePermissionMutation = { __typename?: 'Mutation', permissionCreate: { __typename?: 'Permission', id: string, name: string, description?: string | null, createdAt: any, updatedAt: any } };

export type UpdatePermissionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
}>;


export type UpdatePermissionMutation = { __typename?: 'Mutation', permissionUpdate: { __typename?: 'Permission', id: string, name: string, description?: string | null, createdAt: any, updatedAt: any } };

export type RemovePermissionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type RemovePermissionMutation = { __typename?: 'Mutation', permissionRemove: boolean };

export type CreateUserMutationVariables = Exact<{
  data: CreateUserDto;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string, description?: string | null }> | null } };

export type RegisterMutationVariables = Exact<{
  data: CreateUserDto;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string }> | null } };

export type UserPermissionsQueryVariables = Exact<{
  publicId: Scalars['String']['input'];
}>;


export type UserPermissionsQuery = { __typename?: 'Query', userPermissions: { __typename?: 'RolesPermissionsResponse', permissions: Array<{ __typename?: 'PermissionDTO', id: number, name: string, createdAt: any, updatedAt: any }>, roles: Array<{ __typename?: 'RoleDTO', id: number, name: string, createdAt: any, updatedAt: any }> } };

export type AddRolesToUserMutationVariables = Exact<{
  publicId: Scalars['String']['input'];
  roleIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type AddRolesToUserMutation = { __typename?: 'Mutation', addRolesToUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string }> | null } };

export type RemoveRolesFromUserMutationVariables = Exact<{
  publicId: Scalars['String']['input'];
  roleIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type RemoveRolesFromUserMutation = { __typename?: 'Mutation', removeRolesFromUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string }> | null } };

export type FindAllUsersQueryVariables = Exact<{
  data: FindAllInput;
}>;


export type FindAllUsersQuery = { __typename?: 'Query', usersFindAll: Array<{ __typename?: 'User', id: string, publicId: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string, description?: string | null }> | null }> };

export type FindUserByPublicIdQueryVariables = Exact<{
  publicId: Scalars['String']['input'];
}>;


export type FindUserByPublicIdQuery = { __typename?: 'Query', findUserByPublicId: { __typename?: 'User', id: string, publicId: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string, description?: string | null }> | null } };

export type GetUserRolesAndPermissionsQueryVariables = Exact<{
  data: UserPermissionsInput;
}>;


export type GetUserRolesAndPermissionsQuery = { __typename?: 'Query', userPermissions: { __typename?: 'RolesPermissionsResponse', permissions: Array<{ __typename?: 'PermissionDTO', id: number, name: string, createdAt: any, updatedAt: any }>, roles: Array<{ __typename?: 'RoleDTO', id: number, name: string, createdAt: any, updatedAt: any }> } };


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(data: {email: $email, password: $password}) {
    accessToken
    refreshToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RefreshDocument = gql`
    mutation Refresh($refreshToken: String!) {
  refresh(refreshToken: $refreshToken) {
    accessToken
    refreshToken
  }
}
    `;
export type RefreshMutationFn = Apollo.MutationFunction<RefreshMutation, RefreshMutationVariables>;

/**
 * __useRefreshMutation__
 *
 * To run a mutation, you first call `useRefreshMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshMutation, { data, loading, error }] = useRefreshMutation({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useRefreshMutation(baseOptions?: Apollo.MutationHookOptions<RefreshMutation, RefreshMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshMutation, RefreshMutationVariables>(RefreshDocument, options);
      }
export type RefreshMutationHookResult = ReturnType<typeof useRefreshMutation>;
export type RefreshMutationResult = Apollo.MutationResult<RefreshMutation>;
export type RefreshMutationOptions = Apollo.BaseMutationOptions<RefreshMutation, RefreshMutationVariables>;
export const CreatePermissionDocument = gql`
    mutation CreatePermission($name: String!, $description: String!) {
  permissionCreate(data: {name: $name, description: $description}) {
    id
    name
    description
    createdAt
    updatedAt
  }
}
    `;
export type CreatePermissionMutationFn = Apollo.MutationFunction<CreatePermissionMutation, CreatePermissionMutationVariables>;

/**
 * __useCreatePermissionMutation__
 *
 * To run a mutation, you first call `useCreatePermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPermissionMutation, { data, loading, error }] = useCreatePermissionMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useCreatePermissionMutation(baseOptions?: Apollo.MutationHookOptions<CreatePermissionMutation, CreatePermissionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePermissionMutation, CreatePermissionMutationVariables>(CreatePermissionDocument, options);
      }
export type CreatePermissionMutationHookResult = ReturnType<typeof useCreatePermissionMutation>;
export type CreatePermissionMutationResult = Apollo.MutationResult<CreatePermissionMutation>;
export type CreatePermissionMutationOptions = Apollo.BaseMutationOptions<CreatePermissionMutation, CreatePermissionMutationVariables>;
export const UpdatePermissionDocument = gql`
    mutation UpdatePermission($id: Int!, $name: String!, $description: String!) {
  permissionUpdate(data: {id: $id, name: $name, description: $description}) {
    id
    name
    description
    createdAt
    updatedAt
  }
}
    `;
export type UpdatePermissionMutationFn = Apollo.MutationFunction<UpdatePermissionMutation, UpdatePermissionMutationVariables>;

/**
 * __useUpdatePermissionMutation__
 *
 * To run a mutation, you first call `useUpdatePermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePermissionMutation, { data, loading, error }] = useUpdatePermissionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdatePermissionMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePermissionMutation, UpdatePermissionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePermissionMutation, UpdatePermissionMutationVariables>(UpdatePermissionDocument, options);
      }
export type UpdatePermissionMutationHookResult = ReturnType<typeof useUpdatePermissionMutation>;
export type UpdatePermissionMutationResult = Apollo.MutationResult<UpdatePermissionMutation>;
export type UpdatePermissionMutationOptions = Apollo.BaseMutationOptions<UpdatePermissionMutation, UpdatePermissionMutationVariables>;
export const RemovePermissionDocument = gql`
    mutation RemovePermission($id: Int!) {
  permissionRemove(data: {id: $id})
}
    `;
export type RemovePermissionMutationFn = Apollo.MutationFunction<RemovePermissionMutation, RemovePermissionMutationVariables>;

/**
 * __useRemovePermissionMutation__
 *
 * To run a mutation, you first call `useRemovePermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePermissionMutation, { data, loading, error }] = useRemovePermissionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemovePermissionMutation(baseOptions?: Apollo.MutationHookOptions<RemovePermissionMutation, RemovePermissionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemovePermissionMutation, RemovePermissionMutationVariables>(RemovePermissionDocument, options);
      }
export type RemovePermissionMutationHookResult = ReturnType<typeof useRemovePermissionMutation>;
export type RemovePermissionMutationResult = Apollo.MutationResult<RemovePermissionMutation>;
export type RemovePermissionMutationOptions = Apollo.BaseMutationOptions<RemovePermissionMutation, RemovePermissionMutationVariables>;
export const CreateUserDocument = gql`
    mutation createUser($data: CreateUserDto!) {
  createUser(data: $data) {
    id
    firstName
    lastName
    email
    phoneNumber
    dateOfBirth
    addressLine1
    addressLine2
    city
    county
    country
    postalCode
    roles {
      id
      name
      description
    }
    createdAt
    updatedAt
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const RegisterDocument = gql`
    mutation register($data: CreateUserDto!) {
  register(data: $data) {
    id
    firstName
    lastName
    email
    phoneNumber
    dateOfBirth
    addressLine1
    addressLine2
    city
    county
    country
    postalCode
    roles {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const UserPermissionsDocument = gql`
    query userPermissions($publicId: String!) {
  userPermissions(data: {publicId: $publicId}) {
    permissions {
      id
      name
      createdAt
      updatedAt
    }
    roles {
      id
      name
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useUserPermissionsQuery__
 *
 * To run a query within a React component, call `useUserPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserPermissionsQuery({
 *   variables: {
 *      publicId: // value for 'publicId'
 *   },
 * });
 */
export function useUserPermissionsQuery(baseOptions: Apollo.QueryHookOptions<UserPermissionsQuery, UserPermissionsQueryVariables> & ({ variables: UserPermissionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserPermissionsQuery, UserPermissionsQueryVariables>(UserPermissionsDocument, options);
      }
export function useUserPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserPermissionsQuery, UserPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserPermissionsQuery, UserPermissionsQueryVariables>(UserPermissionsDocument, options);
        }
export function useUserPermissionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserPermissionsQuery, UserPermissionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserPermissionsQuery, UserPermissionsQueryVariables>(UserPermissionsDocument, options);
        }
export type UserPermissionsQueryHookResult = ReturnType<typeof useUserPermissionsQuery>;
export type UserPermissionsLazyQueryHookResult = ReturnType<typeof useUserPermissionsLazyQuery>;
export type UserPermissionsSuspenseQueryHookResult = ReturnType<typeof useUserPermissionsSuspenseQuery>;
export type UserPermissionsQueryResult = Apollo.QueryResult<UserPermissionsQuery, UserPermissionsQueryVariables>;
export const AddRolesToUserDocument = gql`
    mutation addRolesToUser($publicId: String!, $roleIds: [Int!]!) {
  addRolesToUser(publicId: $publicId, roleIds: $roleIds) {
    id
    firstName
    lastName
    email
    phoneNumber
    dateOfBirth
    addressLine1
    addressLine2
    city
    county
    country
    postalCode
    roles {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;
export type AddRolesToUserMutationFn = Apollo.MutationFunction<AddRolesToUserMutation, AddRolesToUserMutationVariables>;

/**
 * __useAddRolesToUserMutation__
 *
 * To run a mutation, you first call `useAddRolesToUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddRolesToUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addRolesToUserMutation, { data, loading, error }] = useAddRolesToUserMutation({
 *   variables: {
 *      publicId: // value for 'publicId'
 *      roleIds: // value for 'roleIds'
 *   },
 * });
 */
export function useAddRolesToUserMutation(baseOptions?: Apollo.MutationHookOptions<AddRolesToUserMutation, AddRolesToUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddRolesToUserMutation, AddRolesToUserMutationVariables>(AddRolesToUserDocument, options);
      }
export type AddRolesToUserMutationHookResult = ReturnType<typeof useAddRolesToUserMutation>;
export type AddRolesToUserMutationResult = Apollo.MutationResult<AddRolesToUserMutation>;
export type AddRolesToUserMutationOptions = Apollo.BaseMutationOptions<AddRolesToUserMutation, AddRolesToUserMutationVariables>;
export const RemoveRolesFromUserDocument = gql`
    mutation removeRolesFromUser($publicId: String!, $roleIds: [Int!]!) {
  removeRolesFromUser(publicId: $publicId, roleIds: $roleIds) {
    id
    firstName
    lastName
    email
    phoneNumber
    dateOfBirth
    addressLine1
    addressLine2
    city
    county
    country
    postalCode
    roles {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;
export type RemoveRolesFromUserMutationFn = Apollo.MutationFunction<RemoveRolesFromUserMutation, RemoveRolesFromUserMutationVariables>;

/**
 * __useRemoveRolesFromUserMutation__
 *
 * To run a mutation, you first call `useRemoveRolesFromUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveRolesFromUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeRolesFromUserMutation, { data, loading, error }] = useRemoveRolesFromUserMutation({
 *   variables: {
 *      publicId: // value for 'publicId'
 *      roleIds: // value for 'roleIds'
 *   },
 * });
 */
export function useRemoveRolesFromUserMutation(baseOptions?: Apollo.MutationHookOptions<RemoveRolesFromUserMutation, RemoveRolesFromUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveRolesFromUserMutation, RemoveRolesFromUserMutationVariables>(RemoveRolesFromUserDocument, options);
      }
export type RemoveRolesFromUserMutationHookResult = ReturnType<typeof useRemoveRolesFromUserMutation>;
export type RemoveRolesFromUserMutationResult = Apollo.MutationResult<RemoveRolesFromUserMutation>;
export type RemoveRolesFromUserMutationOptions = Apollo.BaseMutationOptions<RemoveRolesFromUserMutation, RemoveRolesFromUserMutationVariables>;
export const FindAllUsersDocument = gql`
    query findAllUsers($data: FindAllInput!) {
  usersFindAll(data: $data) {
    id
    publicId
    firstName
    lastName
    email
    phoneNumber
    dateOfBirth
    addressLine1
    addressLine2
    city
    county
    country
    postalCode
    roles {
      id
      name
      description
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useFindAllUsersQuery__
 *
 * To run a query within a React component, call `useFindAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllUsersQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useFindAllUsersQuery(baseOptions: Apollo.QueryHookOptions<FindAllUsersQuery, FindAllUsersQueryVariables> & ({ variables: FindAllUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllUsersQuery, FindAllUsersQueryVariables>(FindAllUsersDocument, options);
      }
export function useFindAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllUsersQuery, FindAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllUsersQuery, FindAllUsersQueryVariables>(FindAllUsersDocument, options);
        }
export function useFindAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindAllUsersQuery, FindAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindAllUsersQuery, FindAllUsersQueryVariables>(FindAllUsersDocument, options);
        }
export type FindAllUsersQueryHookResult = ReturnType<typeof useFindAllUsersQuery>;
export type FindAllUsersLazyQueryHookResult = ReturnType<typeof useFindAllUsersLazyQuery>;
export type FindAllUsersSuspenseQueryHookResult = ReturnType<typeof useFindAllUsersSuspenseQuery>;
export type FindAllUsersQueryResult = Apollo.QueryResult<FindAllUsersQuery, FindAllUsersQueryVariables>;
export const FindUserByPublicIdDocument = gql`
    query findUserByPublicId($publicId: String!) {
  findUserByPublicId(publicId: $publicId) {
    id
    publicId
    firstName
    lastName
    email
    phoneNumber
    dateOfBirth
    addressLine1
    addressLine2
    city
    county
    country
    postalCode
    roles {
      id
      name
      description
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useFindUserByPublicIdQuery__
 *
 * To run a query within a React component, call `useFindUserByPublicIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUserByPublicIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindUserByPublicIdQuery({
 *   variables: {
 *      publicId: // value for 'publicId'
 *   },
 * });
 */
export function useFindUserByPublicIdQuery(baseOptions: Apollo.QueryHookOptions<FindUserByPublicIdQuery, FindUserByPublicIdQueryVariables> & ({ variables: FindUserByPublicIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindUserByPublicIdQuery, FindUserByPublicIdQueryVariables>(FindUserByPublicIdDocument, options);
      }
export function useFindUserByPublicIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindUserByPublicIdQuery, FindUserByPublicIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindUserByPublicIdQuery, FindUserByPublicIdQueryVariables>(FindUserByPublicIdDocument, options);
        }
export function useFindUserByPublicIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindUserByPublicIdQuery, FindUserByPublicIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindUserByPublicIdQuery, FindUserByPublicIdQueryVariables>(FindUserByPublicIdDocument, options);
        }
export type FindUserByPublicIdQueryHookResult = ReturnType<typeof useFindUserByPublicIdQuery>;
export type FindUserByPublicIdLazyQueryHookResult = ReturnType<typeof useFindUserByPublicIdLazyQuery>;
export type FindUserByPublicIdSuspenseQueryHookResult = ReturnType<typeof useFindUserByPublicIdSuspenseQuery>;
export type FindUserByPublicIdQueryResult = Apollo.QueryResult<FindUserByPublicIdQuery, FindUserByPublicIdQueryVariables>;
export const GetUserRolesAndPermissionsDocument = gql`
    query getUserRolesAndPermissions($data: UserPermissionsInput!) {
  userPermissions(data: $data) {
    permissions {
      id
      name
      createdAt
      updatedAt
    }
    roles {
      id
      name
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetUserRolesAndPermissionsQuery__
 *
 * To run a query within a React component, call `useGetUserRolesAndPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserRolesAndPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserRolesAndPermissionsQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetUserRolesAndPermissionsQuery(baseOptions: Apollo.QueryHookOptions<GetUserRolesAndPermissionsQuery, GetUserRolesAndPermissionsQueryVariables> & ({ variables: GetUserRolesAndPermissionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserRolesAndPermissionsQuery, GetUserRolesAndPermissionsQueryVariables>(GetUserRolesAndPermissionsDocument, options);
      }
export function useGetUserRolesAndPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserRolesAndPermissionsQuery, GetUserRolesAndPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserRolesAndPermissionsQuery, GetUserRolesAndPermissionsQueryVariables>(GetUserRolesAndPermissionsDocument, options);
        }
export function useGetUserRolesAndPermissionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserRolesAndPermissionsQuery, GetUserRolesAndPermissionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserRolesAndPermissionsQuery, GetUserRolesAndPermissionsQueryVariables>(GetUserRolesAndPermissionsDocument, options);
        }
export type GetUserRolesAndPermissionsQueryHookResult = ReturnType<typeof useGetUserRolesAndPermissionsQuery>;
export type GetUserRolesAndPermissionsLazyQueryHookResult = ReturnType<typeof useGetUserRolesAndPermissionsLazyQuery>;
export type GetUserRolesAndPermissionsSuspenseQueryHookResult = ReturnType<typeof useGetUserRolesAndPermissionsSuspenseQuery>;
export type GetUserRolesAndPermissionsQueryResult = Apollo.QueryResult<GetUserRolesAndPermissionsQuery, GetUserRolesAndPermissionsQueryVariables>;