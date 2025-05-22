export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AssignmentEntity = {
  __typename?: 'AssignmentEntity';
  class: ClassEntity;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  lesson: LessonEntity;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AssignmentSubmissionEntity = {
  __typename?: 'AssignmentSubmissionEntity';
  assignment: AssignmentEntity;
  createdAt: Scalars['DateTime']['output'];
  feedback?: Maybe<Scalars['String']['output']>;
  grade?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  student: StudentProfileDto;
  submissionContent?: Maybe<Scalars['String']['output']>;
  submittedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AuthTokens = {
  __typename?: 'AuthTokens';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type ClassByYearSubjectInput = {
  pagination?: InputMaybe<PaginationInput>;
  subjectId: Scalars['ID']['input'];
  withEducators?: Scalars['Boolean']['input'];
  withStudents?: Scalars['Boolean']['input'];
  yearGroupId: Scalars['ID']['input'];
};

export type ClassEntity = {
  __typename?: 'ClassEntity';
  createdAt: Scalars['DateTime']['output'];
  educators?: Maybe<Array<EducatorProfileDto>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  students?: Maybe<Array<StudentProfileDto>>;
  subject: SubjectEntity;
  updatedAt: Scalars['DateTime']['output'];
  yearGroup: YearGroupEntity;
};

export type CreateAssignmentInput = {
  classId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  lessonId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreateAssignmentSubmissionInput = {
  assignmentId: Scalars['ID']['input'];
  feedback?: InputMaybe<Scalars['String']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  studentId: Scalars['ID']['input'];
  submissionContent?: InputMaybe<Scalars['String']['input']>;
  submittedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CreateClassInput = {
  name: Scalars['String']['input'];
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type CreateEducatorProfileInput = {
  staffId: Scalars['Float']['input'];
};

export type CreateKeyStageInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateLessonInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  createdByEducatorId?: InputMaybe<Scalars['ID']['input']>;
  recommendedYearGroupIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  subjectId?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
};

export type CreatePermissionGroupInput = {
  description: Scalars['String']['input'];
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

export type CreateStudentProfileInput = {
  schoolYear: Scalars['Float']['input'];
  studentId: Scalars['Float']['input'];
};

export type CreateSubjectInput = {
  name: Scalars['String']['input'];
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type CreateUserRequestDto = {
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
  userType: Scalars['String']['input'];
};

export type CreateUserWithProfileInput = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  county?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  educatorProfile?: InputMaybe<CreateEducatorProfileInput>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  studentProfile?: InputMaybe<CreateStudentProfileInput>;
  userType: Scalars['String']['input'];
};

export type CreateYearGroupInput = {
  keyStageId?: InputMaybe<Scalars['ID']['input']>;
  year: ValidYear;
};

export type EducatorProfileDto = {
  __typename?: 'EducatorProfileDto';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  staffId: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type FilterInput = {
  /** Column (property) name to filter on */
  column: Scalars['String']['input'];
  /** Exact value the column must equal */
  value: Scalars['String']['input'];
};

export type FindAllInput = {
  /** Set to true to return all records, ignoring pagination values */
  all?: InputMaybe<Scalars['Boolean']['input']>;
  /** Column/value pairs to filter by (records must satisfy **all** filters) */
  filters?: InputMaybe<Array<FilterInput>>;
  /** Maximum number of records to return */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of records to skip */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Names of relations to eager-load (e.g. ["keyStage", "author"]) */
  relations?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FindOneByInput = {
  column: Scalars['String']['input'];
  /** Relations to eager-load with this single record */
  relations?: InputMaybe<Array<Scalars['String']['input']>>;
  value: Scalars['String']['input'];
};

export type IdInput = {
  id: Scalars['Int']['input'];
  /** Relations to eager-load with this single record */
  relations?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type IdRequestDto = {
  id: Scalars['Int']['input'];
};

export type KeyStageEntity = {
  __typename?: 'KeyStageEntity';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  stage: ValidKeyStage;
  updatedAt: Scalars['DateTime']['output'];
  yearGroups: Array<YearGroupEntity>;
};

export type LessonEntity = {
  __typename?: 'LessonEntity';
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<EducatorProfileDto>;
  createdById?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  recommendedYearGroups?: Maybe<Array<YearGroupEntity>>;
  subject?: Maybe<SubjectEntity>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LoginRequest = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  userDetails: UserDetails;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create one Assignment */
  createAssignment: AssignmentEntity;
  /** Create one AssignmentSubmission */
  createAssignmentSubmission: AssignmentSubmissionEntity;
  /** Create one Class */
  createClass: ClassEntity;
  /** Create one EducatorProfile */
  createEducatorProfile: EducatorProfileDto;
  /** Create one KeyStage */
  createKeyStage: KeyStageEntity;
  /** Create one Lesson */
  createLesson: LessonEntity;
  /** Create one Permission */
  createPermission: Permission;
  /** Create one PermissionGroup */
  createPermissionGroup: PermissionGroup;
  /** Create one Role */
  createRole: Role;
  /** Create one StudentProfile */
  createStudentProfile: StudentProfileDto;
  /** Create one Subject */
  createSubject: SubjectEntity;
  createUser: User;
  createUserWithProfile: User;
  /** Create one YearGroup */
  createYearGroup: YearGroupEntity;
  /** Delete one Assignment */
  deleteAssignment: Scalars['Boolean']['output'];
  /** Delete one AssignmentSubmission */
  deleteAssignmentSubmission: Scalars['Boolean']['output'];
  /** Delete one Class */
  deleteClass: Scalars['Boolean']['output'];
  /** Delete one EducatorProfile */
  deleteEducatorProfile: Scalars['Boolean']['output'];
  /** Delete one KeyStage */
  deleteKeyStage: Scalars['Boolean']['output'];
  /** Delete one Lesson */
  deleteLesson: Scalars['Boolean']['output'];
  /** Delete one Permission */
  deletePermission: Scalars['Boolean']['output'];
  /** Delete one PermissionGroup */
  deletePermissionGroup: Scalars['Boolean']['output'];
  /** Delete one Role */
  deleteRole: Scalars['Boolean']['output'];
  /** Delete one StudentProfile */
  deleteStudentProfile: Scalars['Boolean']['output'];
  /** Delete one Subject */
  deleteSubject: Scalars['Boolean']['output'];
  /** Delete one YearGroup */
  deleteYearGroup: Scalars['Boolean']['output'];
  logUserInWithEmailAndPassword: AuthTokens;
  refreshUsersTokens: LoginResponse;
  registerNewUserLocally: User;
  removeUserByPublicId: User;
  /** Updates one Assignment */
  updateAssignment: AssignmentEntity;
  /** Updates one AssignmentSubmission */
  updateAssignmentSubmission: AssignmentSubmissionEntity;
  /** Updates one Class */
  updateClass: ClassEntity;
  /** Updates one EducatorProfile */
  updateEducatorProfile: EducatorProfileDto;
  /** Updates one KeyStage */
  updateKeyStage: KeyStageEntity;
  /** Updates one Lesson */
  updateLesson: LessonEntity;
  /** Updates one Permission */
  updatePermission: Permission;
  /** Updates one PermissionGroup */
  updatePermissionGroup: PermissionGroup;
  updatePermissionGroupPermissionsFromArray: PermissionGroup;
  updatePermissionGroupsForRole: Role;
  /** Updates one Role */
  updateRole: Role;
  /** Updates one StudentProfile */
  updateStudentProfile: StudentProfileDto;
  /** Updates one Subject */
  updateSubject: SubjectEntity;
  updateUserByPublicId: User;
  updateUserRolesFromArray: User;
  /** Updates one YearGroup */
  updateYearGroup: YearGroupEntity;
};


export type MutationCreateAssignmentArgs = {
  data: CreateAssignmentInput;
};


export type MutationCreateAssignmentSubmissionArgs = {
  data: CreateAssignmentSubmissionInput;
};


export type MutationCreateClassArgs = {
  data: CreateClassInput;
};


export type MutationCreateEducatorProfileArgs = {
  data: CreateEducatorProfileInput;
};


export type MutationCreateKeyStageArgs = {
  data: CreateKeyStageInput;
};


export type MutationCreateLessonArgs = {
  data: CreateLessonInput;
};


export type MutationCreatePermissionArgs = {
  data: CreatePermissionInput;
};


export type MutationCreatePermissionGroupArgs = {
  data: CreatePermissionGroupInput;
};


export type MutationCreateRoleArgs = {
  data: CreateRoleInput;
};


export type MutationCreateStudentProfileArgs = {
  data: CreateStudentProfileInput;
};


export type MutationCreateSubjectArgs = {
  data: CreateSubjectInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserRequestDto;
};


export type MutationCreateUserWithProfileArgs = {
  data: CreateUserWithProfileInput;
};


export type MutationCreateYearGroupArgs = {
  data: CreateYearGroupInput;
};


export type MutationDeleteAssignmentArgs = {
  data: IdInput;
};


export type MutationDeleteAssignmentSubmissionArgs = {
  data: IdInput;
};


export type MutationDeleteClassArgs = {
  data: IdInput;
};


export type MutationDeleteEducatorProfileArgs = {
  data: IdInput;
};


export type MutationDeleteKeyStageArgs = {
  data: IdInput;
};


export type MutationDeleteLessonArgs = {
  data: IdInput;
};


export type MutationDeletePermissionArgs = {
  data: IdInput;
};


export type MutationDeletePermissionGroupArgs = {
  data: IdInput;
};


export type MutationDeleteRoleArgs = {
  data: IdInput;
};


export type MutationDeleteStudentProfileArgs = {
  data: IdInput;
};


export type MutationDeleteSubjectArgs = {
  data: IdInput;
};


export type MutationDeleteYearGroupArgs = {
  data: IdInput;
};


export type MutationLogUserInWithEmailAndPasswordArgs = {
  data: LoginRequest;
};


export type MutationRefreshUsersTokensArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterNewUserLocallyArgs = {
  data: CreateUserRequestDto;
};


export type MutationRemoveUserByPublicIdArgs = {
  data: PublicIdRequestDto;
};


export type MutationUpdateAssignmentArgs = {
  data: UpdateAssignmentInput;
};


export type MutationUpdateAssignmentSubmissionArgs = {
  data: UpdateAssignmentSubmissionInput;
};


export type MutationUpdateClassArgs = {
  data: UpdateClassInput;
};


export type MutationUpdateEducatorProfileArgs = {
  data: UpdateEducatorProfileInput;
};


export type MutationUpdateKeyStageArgs = {
  data: UpdateKeyStageInput;
};


export type MutationUpdateLessonArgs = {
  data: UpdateLessonInput;
};


export type MutationUpdatePermissionArgs = {
  data: UpdatePermissionInput;
};


export type MutationUpdatePermissionGroupArgs = {
  data: UpdatePermissionGroupInput;
};


export type MutationUpdatePermissionGroupPermissionsFromArrayArgs = {
  data: SubmitIdArrayByIdRequestDto;
};


export type MutationUpdatePermissionGroupsForRoleArgs = {
  data: SubmitIdArrayByIdRequestDto;
};


export type MutationUpdateRoleArgs = {
  data: UpdateRoleInput;
};


export type MutationUpdateStudentProfileArgs = {
  data: UpdateStudentProfileInput;
};


export type MutationUpdateSubjectArgs = {
  data: UpdateSubjectInput;
};


export type MutationUpdateUserByPublicIdArgs = {
  data: UpdateUserWithProfileInput;
  publicId: Scalars['String']['input'];
};


export type MutationUpdateUserRolesFromArrayArgs = {
  data: UpdateUserRolesFromArrayRequestDto;
};


export type MutationUpdateYearGroupArgs = {
  data: UpdateYearGroupInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  itemCount: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
};

export type PaginatedGetAllRequestDto = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PaginationInput = {
  page?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
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
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<Permission>>;
  roles?: Maybe<Array<Role>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PublicIdRequestDto = {
  publicId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  classesByYearAndSubject: Array<ClassEntity>;
  /** Returns all Assignment (optionally filtered) */
  getAllAssignment: Array<AssignmentEntity>;
  /** Returns all AssignmentSubmission (optionally filtered) */
  getAllAssignmentSubmission: Array<AssignmentSubmissionEntity>;
  /** Returns all Class (optionally filtered) */
  getAllClass: Array<ClassEntity>;
  /** Returns all EducatorProfile (optionally filtered) */
  getAllEducatorProfile: Array<EducatorProfileDto>;
  /** Returns all KeyStage (optionally filtered) */
  getAllKeyStage: Array<KeyStageEntity>;
  /** Returns all Lesson (optionally filtered) */
  getAllLesson: Array<LessonEntity>;
  /** Returns all Permission (optionally filtered) */
  getAllPermission: Array<Permission>;
  /** Returns all PermissionGroup (optionally filtered) */
  getAllPermissionGroup: Array<PermissionGroup>;
  /** Returns all Role (optionally filtered) */
  getAllRole: Array<Role>;
  /** Returns all StudentProfile (optionally filtered) */
  getAllStudentProfile: Array<StudentProfileDto>;
  /** Returns all Subject (optionally filtered) */
  getAllSubject: Array<SubjectEntity>;
  getAllUsers: Array<User>;
  /** Returns all YearGroup (optionally filtered) */
  getAllYearGroup: Array<YearGroupEntity>;
  /** Returns one Assignment */
  getAssignment: AssignmentEntity;
  /** Returns one Assignment by given conditions */
  getAssignmentBy: AssignmentEntity;
  /** Returns one AssignmentSubmission */
  getAssignmentSubmission: AssignmentSubmissionEntity;
  /** Returns one AssignmentSubmission by given conditions */
  getAssignmentSubmissionBy: AssignmentSubmissionEntity;
  /** Returns one Class */
  getClass: ClassEntity;
  /** Returns one Class by given conditions */
  getClassBy: ClassEntity;
  /** Returns one EducatorProfile */
  getEducatorProfile: EducatorProfileDto;
  /** Returns one EducatorProfile by given conditions */
  getEducatorProfileBy: EducatorProfileDto;
  /** Returns one KeyStage */
  getKeyStage: KeyStageEntity;
  /** Returns one KeyStage by given conditions */
  getKeyStageBy: KeyStageEntity;
  /** Returns one Lesson */
  getLesson: LessonEntity;
  /** Returns one Lesson by given conditions */
  getLessonBy: LessonEntity;
  /** Returns one Permission */
  getPermission: Permission;
  /** Returns one Permission by given conditions */
  getPermissionBy: Permission;
  /** Returns one PermissionGroup */
  getPermissionGroup: PermissionGroup;
  /** Returns one PermissionGroup by given conditions */
  getPermissionGroupBy: PermissionGroup;
  getPermissionGroupsForRole: Array<PermissionGroup>;
  getPermissionsForGroup: Array<Permission>;
  /** Returns one Role */
  getRole: Role;
  /** Returns one Role by given conditions */
  getRoleBy: Role;
  getRolesForUser: Array<Role>;
  /** Returns one StudentProfile */
  getStudentProfile: StudentProfileDto;
  /** Returns one StudentProfile by given conditions */
  getStudentProfileBy: StudentProfileDto;
  /** Returns one Subject */
  getSubject: SubjectEntity;
  /** Returns one Subject by given conditions */
  getSubjectBy: SubjectEntity;
  getUserByPublicId: User;
  getUsersRolesAndPermissions: RolesPermissionsResponse;
  /** Returns one YearGroup */
  getYearGroup: YearGroupEntity;
  /** Returns one YearGroup by given conditions */
  getYearGroupBy: YearGroupEntity;
};


export type QueryClassesByYearAndSubjectArgs = {
  input: ClassByYearSubjectInput;
};


export type QueryGetAllAssignmentArgs = {
  data: FindAllInput;
};


export type QueryGetAllAssignmentSubmissionArgs = {
  data: FindAllInput;
};


export type QueryGetAllClassArgs = {
  data: FindAllInput;
};


export type QueryGetAllEducatorProfileArgs = {
  data: FindAllInput;
};


export type QueryGetAllKeyStageArgs = {
  data: FindAllInput;
};


export type QueryGetAllLessonArgs = {
  data: FindAllInput;
};


export type QueryGetAllPermissionArgs = {
  data: FindAllInput;
};


export type QueryGetAllPermissionGroupArgs = {
  data: FindAllInput;
};


export type QueryGetAllRoleArgs = {
  data: FindAllInput;
};


export type QueryGetAllStudentProfileArgs = {
  data: FindAllInput;
};


export type QueryGetAllSubjectArgs = {
  data: FindAllInput;
};


export type QueryGetAllUsersArgs = {
  data: PaginatedGetAllRequestDto;
};


export type QueryGetAllYearGroupArgs = {
  data: FindAllInput;
};


export type QueryGetAssignmentArgs = {
  data: IdInput;
};


export type QueryGetAssignmentByArgs = {
  data: FindOneByInput;
};


export type QueryGetAssignmentSubmissionArgs = {
  data: IdInput;
};


export type QueryGetAssignmentSubmissionByArgs = {
  data: FindOneByInput;
};


export type QueryGetClassArgs = {
  data: IdInput;
};


export type QueryGetClassByArgs = {
  data: FindOneByInput;
};


export type QueryGetEducatorProfileArgs = {
  data: IdInput;
};


export type QueryGetEducatorProfileByArgs = {
  data: FindOneByInput;
};


export type QueryGetKeyStageArgs = {
  data: IdInput;
};


export type QueryGetKeyStageByArgs = {
  data: FindOneByInput;
};


export type QueryGetLessonArgs = {
  data: IdInput;
};


export type QueryGetLessonByArgs = {
  data: FindOneByInput;
};


export type QueryGetPermissionArgs = {
  data: IdInput;
};


export type QueryGetPermissionByArgs = {
  data: FindOneByInput;
};


export type QueryGetPermissionGroupArgs = {
  data: IdInput;
};


export type QueryGetPermissionGroupByArgs = {
  data: FindOneByInput;
};


export type QueryGetPermissionGroupsForRoleArgs = {
  data: IdRequestDto;
};


export type QueryGetPermissionsForGroupArgs = {
  data: IdRequestDto;
};


export type QueryGetRoleArgs = {
  data: IdInput;
};


export type QueryGetRoleByArgs = {
  data: FindOneByInput;
};


export type QueryGetRolesForUserArgs = {
  data: PublicIdRequestDto;
};


export type QueryGetStudentProfileArgs = {
  data: IdInput;
};


export type QueryGetStudentProfileByArgs = {
  data: FindOneByInput;
};


export type QueryGetSubjectArgs = {
  data: IdInput;
};


export type QueryGetSubjectByArgs = {
  data: FindOneByInput;
};


export type QueryGetUserByPublicIdArgs = {
  data: PublicIdRequestDto;
};


export type QueryGetUsersRolesAndPermissionsArgs = {
  data: UserPermissionsInput;
};


export type QueryGetYearGroupArgs = {
  data: IdInput;
};


export type QueryGetYearGroupByArgs = {
  data: FindOneByInput;
};

export type RelationIdsInput = {
  ids: Array<Scalars['ID']['input']>;
  relation: Scalars['String']['input'];
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
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

export type StudentProfileDto = {
  __typename?: 'StudentProfileDto';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  schoolYear: Scalars['Float']['output'];
  studentId: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SubjectEntity = {
  __typename?: 'SubjectEntity';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  yearGroups?: Maybe<Array<YearGroupEntity>>;
};

export type SubmitIdArrayByIdRequestDto = {
  idArray: Array<Scalars['Int']['input']>;
  recordId: Scalars['Int']['input'];
};

export type UpdateAssignmentInput = {
  classId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  lessonId?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAssignmentSubmissionInput = {
  assignmentId?: InputMaybe<Scalars['ID']['input']>;
  feedback?: InputMaybe<Scalars['String']['input']>;
  grade?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  studentId?: InputMaybe<Scalars['ID']['input']>;
  submissionContent?: InputMaybe<Scalars['String']['input']>;
  submittedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateClassInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type UpdateEducatorProfileInput = {
  id: Scalars['Int']['input'];
  staffId?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateKeyStageInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLessonInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  createdByEducatorId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  recommendedYearGroupIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  subjectId?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateStudentProfileInput = {
  id: Scalars['Int']['input'];
  schoolYear?: InputMaybe<Scalars['Float']['input']>;
  studentId?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateSubjectInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type UpdateUserRolesFromArrayRequestDto = {
  publicId: Scalars['String']['input'];
  roleIds: Array<Scalars['Int']['input']>;
};

export type UpdateUserWithProfileInput = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  county?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  educatorProfile?: InputMaybe<CreateEducatorProfileInput>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  publicId: Scalars['String']['input'];
  studentProfile?: InputMaybe<CreateStudentProfileInput>;
  userType: Scalars['String']['input'];
};

export type UpdateYearGroupInput = {
  id: Scalars['ID']['input'];
  keyStageId?: InputMaybe<Scalars['ID']['input']>;
  year?: InputMaybe<ValidYear>;
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
  educatorProfile?: Maybe<EducatorProfileDto>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  publicId: Scalars['String']['output'];
  roles?: Maybe<Array<Role>>;
  studentProfile?: Maybe<StudentProfileDto>;
  updatedAt: Scalars['DateTime']['output'];
  userType: Scalars['String']['output'];
};

export type UserDetails = {
  __typename?: 'UserDetails';
  permissions: Array<Scalars['String']['output']>;
  publicId: Scalars['String']['output'];
};

export type UserPermissionsInput = {
  publicId: Scalars['String']['input'];
};

/** National Curriculum Key Stage (3, 4 or 5) */
export enum ValidKeyStage {
  Ks3 = 'KS3',
  Ks4 = 'KS4',
  Ks5 = 'KS5'
}

export enum ValidYear {
  Year7 = 'Year7',
  Year8 = 'Year8',
  Year9 = 'Year9',
  Year10 = 'Year10',
  Year11 = 'Year11',
  Year12 = 'Year12',
  Year13 = 'Year13'
}

export type YearGroupEntity = {
  __typename?: 'YearGroupEntity';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  keyStage?: Maybe<KeyStageEntity>;
  subjects?: Maybe<Array<SubjectEntity>>;
  updatedAt: Scalars['DateTime']['output'];
  year: ValidYear;
};
