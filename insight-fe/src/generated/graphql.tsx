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
  /** Create one Permission */
  createPermission: Permission;
  createUser: User;
  /** Create one permissionGroup */
  createpermissionGroup: PermissionGroup;
  /** Create one role */
  createrole: Role;
  /** Delete one Permission */
  deletePermission: Scalars['Boolean']['output'];
  /** Delete one permissionGroup */
  deletepermissionGroup: Scalars['Boolean']['output'];
  /** Delete one role */
  deleterole: Scalars['Boolean']['output'];
  logUserInWithEmailAndPassword: AuthTokens;
  refreshUsersTokens: AuthTokens;
  registerNewUserLocally: User;
  removePermissionGroupsFromRole: Role;
  removePermissionsFromGroup: PermissionGroup;
  removePermissionsFromRole: Role;
  removeRolesFromUser: User;
  removeUser: Scalars['Boolean']['output'];
  /** Updates one Permission */
  updatePermission: Permission;
  updateUserByPublicId: User;
  /** Updates one permissionGroup */
  updatepermissionGroup: PermissionGroup;
  /** Updates one role */
  updaterole: Role;
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


export type MutationCreatePermissionArgs = {
  data: CreatePermissionInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserDto;
};


export type MutationCreatepermissionGroupArgs = {
  data: CreatePermissionGroupInput;
};


export type MutationCreateroleArgs = {
  data: CreateRoleInput;
};


export type MutationDeletePermissionArgs = {
  data: IdInput;
};


export type MutationDeletepermissionGroupArgs = {
  data: IdInput;
};


export type MutationDeleteroleArgs = {
  data: IdInput;
};


export type MutationLogUserInWithEmailAndPasswordArgs = {
  data: LoginRequest;
};


export type MutationRefreshUsersTokensArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterNewUserLocallyArgs = {
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


export type MutationUpdatePermissionArgs = {
  data: UpdatePermissionInput;
};


export type MutationUpdateUserByPublicIdArgs = {
  data: UpdateUserDto;
  publicId: Scalars['String']['input'];
};


export type MutationUpdatepermissionGroupArgs = {
  data: UpdatePermissionGroupInput;
};


export type MutationUpdateroleArgs = {
  data: UpdateRoleInput;
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
  /** Returns all Permission */
  getAllPermission: Array<Permission>;
  getAllUsers: Array<User>;
  /** Returns all permissionGroup */
  getAllpermissionGroup: Array<PermissionGroup>;
  /** Returns all role */
  getAllrole: Array<Role>;
  /** Returns one Permission */
  getPermission: Permission;
  /** Returns one Permission by given conditions */
  getPermissionBy: Permission;
  getUsersRolesAndPermissions: RolesPermissionsResponse;
  /** Returns one permissionGroup */
  getpermissionGroup: PermissionGroup;
  /** Returns one permissionGroup by given conditions */
  getpermissionGroupBy: PermissionGroup;
  /** Returns one role */
  getrole: Role;
  /** Returns one role by given conditions */
  getroleBy: Role;
};


export type QueryFindUserByPublicIdArgs = {
  publicId: Scalars['String']['input'];
};


export type QueryGetAllPermissionArgs = {
  data: FindAllInput;
};


export type QueryGetAllUsersArgs = {
  data: FindAllInput;
};


export type QueryGetAllpermissionGroupArgs = {
  data: FindAllInput;
};


export type QueryGetAllroleArgs = {
  data: FindAllInput;
};


export type QueryGetPermissionArgs = {
  data: IdInput;
};


export type QueryGetPermissionByArgs = {
  data: FindOneByInput;
};


export type QueryGetUsersRolesAndPermissionsArgs = {
  data: UserPermissionsInput;
};


export type QueryGetpermissionGroupArgs = {
  data: IdInput;
};


export type QueryGetpermissionGroupByArgs = {
  data: FindOneByInput;
};


export type QueryGetroleArgs = {
  data: IdInput;
};


export type QueryGetroleByArgs = {
  data: FindOneByInput;
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

export type LogUserInWithEmailAndPasswordMutationVariables = Exact<{
  data: LoginRequest;
}>;


export type LogUserInWithEmailAndPasswordMutation = { __typename?: 'Mutation', logUserInWithEmailAndPassword: { __typename?: 'AuthTokens', accessToken: string, refreshToken: string } };

export type RefreshUsersTokensMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshUsersTokensMutation = { __typename?: 'Mutation', refreshUsersTokens: { __typename?: 'AuthTokens', accessToken: string, refreshToken: string } };

export type CreatePermissionMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
}>;


export type CreatePermissionMutation = { __typename?: 'Mutation', createPermission: { __typename?: 'Permission', id: string, name: string, description?: string | null, createdAt: any, updatedAt: any } };

export type DeletePermissionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeletePermissionMutation = { __typename?: 'Mutation', deletePermission: boolean };

export type UpdatePermissionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
}>;


export type UpdatePermissionMutation = { __typename?: 'Mutation', updatePermission: { __typename?: 'Permission', id: string, name: string, description?: string | null, createdAt: any, updatedAt: any } };

export type GetUsersRolesAndPermissionsQueryVariables = Exact<{
  data: UserPermissionsInput;
}>;


export type GetUsersRolesAndPermissionsQuery = { __typename?: 'Query', getUsersRolesAndPermissions: { __typename?: 'RolesPermissionsResponse', permissions: Array<{ __typename?: 'PermissionDTO', id: number, name: string, createdAt: any, updatedAt: any }>, roles: Array<{ __typename?: 'RoleDTO', id: number, name: string, createdAt: any, updatedAt: any }> } };

export type AddRolesToUserMutationVariables = Exact<{
  publicId: Scalars['String']['input'];
  roleIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type AddRolesToUserMutation = { __typename?: 'Mutation', addRolesToUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string }> | null } };

export type CreateUserMutationVariables = Exact<{
  data: CreateUserDto;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string, description?: string | null }> | null } };

export type RegisterNewUserLocallyMutationVariables = Exact<{
  data: CreateUserDto;
}>;


export type RegisterNewUserLocallyMutation = { __typename?: 'Mutation', registerNewUserLocally: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string }> | null } };

export type RemoveRolesFromUserMutationVariables = Exact<{
  publicId: Scalars['String']['input'];
  roleIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type RemoveRolesFromUserMutation = { __typename?: 'Mutation', removeRolesFromUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string }> | null } };

export type RemoveUserMutationVariables = Exact<{
  publicId: Scalars['String']['input'];
}>;


export type RemoveUserMutation = { __typename?: 'Mutation', removeUser: boolean };

export type FindUserByPublicIdQueryVariables = Exact<{
  publicId: Scalars['String']['input'];
}>;


export type FindUserByPublicIdQuery = { __typename?: 'Query', findUserByPublicId: { __typename?: 'User', id: string, publicId: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string, description?: string | null }> | null } };

export type GetAllUsersQueryVariables = Exact<{
  data: FindAllInput;
}>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id: string, publicId: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, dateOfBirth?: any | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, county?: string | null, country?: string | null, postalCode?: string | null, createdAt: any, updatedAt: any, roles?: Array<{ __typename?: 'Role', id: string, name: string, description?: string | null }> | null }> };


export const LogUserInWithEmailAndPasswordDocument = gql`
    mutation LogUserInWithEmailAndPassword($data: LoginRequest!) {
  logUserInWithEmailAndPassword(data: $data) {
    accessToken
    refreshToken
  }
}
    `;
export type LogUserInWithEmailAndPasswordMutationFn = Apollo.MutationFunction<LogUserInWithEmailAndPasswordMutation, LogUserInWithEmailAndPasswordMutationVariables>;

/**
 * __useLogUserInWithEmailAndPasswordMutation__
 *
 * To run a mutation, you first call `useLogUserInWithEmailAndPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogUserInWithEmailAndPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logUserInWithEmailAndPasswordMutation, { data, loading, error }] = useLogUserInWithEmailAndPasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLogUserInWithEmailAndPasswordMutation(baseOptions?: Apollo.MutationHookOptions<LogUserInWithEmailAndPasswordMutation, LogUserInWithEmailAndPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogUserInWithEmailAndPasswordMutation, LogUserInWithEmailAndPasswordMutationVariables>(LogUserInWithEmailAndPasswordDocument, options);
      }
export type LogUserInWithEmailAndPasswordMutationHookResult = ReturnType<typeof useLogUserInWithEmailAndPasswordMutation>;
export type LogUserInWithEmailAndPasswordMutationResult = Apollo.MutationResult<LogUserInWithEmailAndPasswordMutation>;
export type LogUserInWithEmailAndPasswordMutationOptions = Apollo.BaseMutationOptions<LogUserInWithEmailAndPasswordMutation, LogUserInWithEmailAndPasswordMutationVariables>;
export const RefreshUsersTokensDocument = gql`
    mutation RefreshUsersTokens($refreshToken: String!) {
  refreshUsersTokens(refreshToken: $refreshToken) {
    accessToken
    refreshToken
  }
}
    `;
export type RefreshUsersTokensMutationFn = Apollo.MutationFunction<RefreshUsersTokensMutation, RefreshUsersTokensMutationVariables>;

/**
 * __useRefreshUsersTokensMutation__
 *
 * To run a mutation, you first call `useRefreshUsersTokensMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshUsersTokensMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshUsersTokensMutation, { data, loading, error }] = useRefreshUsersTokensMutation({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useRefreshUsersTokensMutation(baseOptions?: Apollo.MutationHookOptions<RefreshUsersTokensMutation, RefreshUsersTokensMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshUsersTokensMutation, RefreshUsersTokensMutationVariables>(RefreshUsersTokensDocument, options);
      }
export type RefreshUsersTokensMutationHookResult = ReturnType<typeof useRefreshUsersTokensMutation>;
export type RefreshUsersTokensMutationResult = Apollo.MutationResult<RefreshUsersTokensMutation>;
export type RefreshUsersTokensMutationOptions = Apollo.BaseMutationOptions<RefreshUsersTokensMutation, RefreshUsersTokensMutationVariables>;
export const CreatePermissionDocument = gql`
    mutation CreatePermission($name: String!, $description: String!) {
  createPermission(data: {name: $name, description: $description}) {
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
export const DeletePermissionDocument = gql`
    mutation DeletePermission($id: Int!) {
  deletePermission(data: {id: $id})
}
    `;
export type DeletePermissionMutationFn = Apollo.MutationFunction<DeletePermissionMutation, DeletePermissionMutationVariables>;

/**
 * __useDeletePermissionMutation__
 *
 * To run a mutation, you first call `useDeletePermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePermissionMutation, { data, loading, error }] = useDeletePermissionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePermissionMutation(baseOptions?: Apollo.MutationHookOptions<DeletePermissionMutation, DeletePermissionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePermissionMutation, DeletePermissionMutationVariables>(DeletePermissionDocument, options);
      }
export type DeletePermissionMutationHookResult = ReturnType<typeof useDeletePermissionMutation>;
export type DeletePermissionMutationResult = Apollo.MutationResult<DeletePermissionMutation>;
export type DeletePermissionMutationOptions = Apollo.BaseMutationOptions<DeletePermissionMutation, DeletePermissionMutationVariables>;
export const UpdatePermissionDocument = gql`
    mutation UpdatePermission($id: Int!, $name: String!, $description: String!) {
  updatePermission(data: {id: $id, name: $name, description: $description}) {
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
export const GetUsersRolesAndPermissionsDocument = gql`
    query GetUsersRolesAndPermissions($data: UserPermissionsInput!) {
  getUsersRolesAndPermissions(data: $data) {
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
 * __useGetUsersRolesAndPermissionsQuery__
 *
 * To run a query within a React component, call `useGetUsersRolesAndPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersRolesAndPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersRolesAndPermissionsQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetUsersRolesAndPermissionsQuery(baseOptions: Apollo.QueryHookOptions<GetUsersRolesAndPermissionsQuery, GetUsersRolesAndPermissionsQueryVariables> & ({ variables: GetUsersRolesAndPermissionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersRolesAndPermissionsQuery, GetUsersRolesAndPermissionsQueryVariables>(GetUsersRolesAndPermissionsDocument, options);
      }
export function useGetUsersRolesAndPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersRolesAndPermissionsQuery, GetUsersRolesAndPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersRolesAndPermissionsQuery, GetUsersRolesAndPermissionsQueryVariables>(GetUsersRolesAndPermissionsDocument, options);
        }
export function useGetUsersRolesAndPermissionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersRolesAndPermissionsQuery, GetUsersRolesAndPermissionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersRolesAndPermissionsQuery, GetUsersRolesAndPermissionsQueryVariables>(GetUsersRolesAndPermissionsDocument, options);
        }
export type GetUsersRolesAndPermissionsQueryHookResult = ReturnType<typeof useGetUsersRolesAndPermissionsQuery>;
export type GetUsersRolesAndPermissionsLazyQueryHookResult = ReturnType<typeof useGetUsersRolesAndPermissionsLazyQuery>;
export type GetUsersRolesAndPermissionsSuspenseQueryHookResult = ReturnType<typeof useGetUsersRolesAndPermissionsSuspenseQuery>;
export type GetUsersRolesAndPermissionsQueryResult = Apollo.QueryResult<GetUsersRolesAndPermissionsQuery, GetUsersRolesAndPermissionsQueryVariables>;
export const AddRolesToUserDocument = gql`
    mutation AddRolesToUser($publicId: String!, $roleIds: [Int!]!) {
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
export const CreateUserDocument = gql`
    mutation CreateUser($data: CreateUserDto!) {
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
export const RegisterNewUserLocallyDocument = gql`
    mutation RegisterNewUserLocally($data: CreateUserDto!) {
  registerNewUserLocally(data: $data) {
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
export type RegisterNewUserLocallyMutationFn = Apollo.MutationFunction<RegisterNewUserLocallyMutation, RegisterNewUserLocallyMutationVariables>;

/**
 * __useRegisterNewUserLocallyMutation__
 *
 * To run a mutation, you first call `useRegisterNewUserLocallyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterNewUserLocallyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerNewUserLocallyMutation, { data, loading, error }] = useRegisterNewUserLocallyMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRegisterNewUserLocallyMutation(baseOptions?: Apollo.MutationHookOptions<RegisterNewUserLocallyMutation, RegisterNewUserLocallyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterNewUserLocallyMutation, RegisterNewUserLocallyMutationVariables>(RegisterNewUserLocallyDocument, options);
      }
export type RegisterNewUserLocallyMutationHookResult = ReturnType<typeof useRegisterNewUserLocallyMutation>;
export type RegisterNewUserLocallyMutationResult = Apollo.MutationResult<RegisterNewUserLocallyMutation>;
export type RegisterNewUserLocallyMutationOptions = Apollo.BaseMutationOptions<RegisterNewUserLocallyMutation, RegisterNewUserLocallyMutationVariables>;
export const RemoveRolesFromUserDocument = gql`
    mutation RemoveRolesFromUser($publicId: String!, $roleIds: [Int!]!) {
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
export const RemoveUserDocument = gql`
    mutation RemoveUser($publicId: String!) {
  removeUser(publicId: $publicId)
}
    `;
export type RemoveUserMutationFn = Apollo.MutationFunction<RemoveUserMutation, RemoveUserMutationVariables>;

/**
 * __useRemoveUserMutation__
 *
 * To run a mutation, you first call `useRemoveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserMutation, { data, loading, error }] = useRemoveUserMutation({
 *   variables: {
 *      publicId: // value for 'publicId'
 *   },
 * });
 */
export function useRemoveUserMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserMutation, RemoveUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveUserMutation, RemoveUserMutationVariables>(RemoveUserDocument, options);
      }
export type RemoveUserMutationHookResult = ReturnType<typeof useRemoveUserMutation>;
export type RemoveUserMutationResult = Apollo.MutationResult<RemoveUserMutation>;
export type RemoveUserMutationOptions = Apollo.BaseMutationOptions<RemoveUserMutation, RemoveUserMutationVariables>;
export const FindUserByPublicIdDocument = gql`
    query FindUserByPublicId($publicId: String!) {
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
export const GetAllUsersDocument = gql`
    query GetAllUsers($data: FindAllInput!) {
  getAllUsers(data: $data) {
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
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables> & ({ variables: GetAllUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;