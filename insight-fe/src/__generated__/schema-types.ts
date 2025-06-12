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
  JSONObject: { input: any; output: any; }
};

export type AssignmentEntity = {
  __typename?: 'AssignmentEntity';
  class: ClassEntity;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  educators?: Maybe<Array<EducatorProfileDto>>;
  id: Scalars['ID']['output'];
  lessons?: Maybe<Array<LessonEntity>>;
  name: Scalars['String']['output'];
  students?: Maybe<Array<StudentProfileDto>>;
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

export type ColorPaletteEntity = {
  __typename?: 'ColorPaletteEntity';
  collection: StyleCollectionEntity;
  collectionId: Scalars['ID']['output'];
  colors: Array<PaletteColor>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PaletteColor = {
  __typename?: 'PaletteColor';
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ComponentVariantEntity = {
  __typename?: 'ComponentVariantEntity';
  accessibleName: Scalars['String']['output'];
  baseComponent: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  props: Scalars['JSONObject']['output'];
  theme: ThemeEntity;
  themeId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateAssignmentInput = {
  classId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
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

export type PaletteColorInput = {
  name: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type CreateColorPaletteInput = {
  collectionId: Scalars['ID']['input'];
  colors: Array<PaletteColorInput>;
  name: Scalars['String']['input'];
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type CreateComponentVariantInput = {
  accessibleName: Scalars['String']['input'];
  baseComponent: Scalars['String']['input'];
  name: Scalars['String']['input'];
  props: Scalars['JSONObject']['input'];
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
  themeId: Scalars['ID']['input'];
};

export type CreateEducatorProfileInput = {
  staffId: Scalars['Float']['input'];
};

export type CreateKeyStageInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateLessonInput = {
  content?: InputMaybe<Array<LessonSlideInput>>;
  createdByEducatorId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  recommendedYearGroupIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
  themeId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreateMultipleChoiceQuestionInput = {
  correctAnswer: Scalars['String']['input'];
  lessonId: Scalars['ID']['input'];
  options: Array<Scalars['String']['input']>;
  quizId?: InputMaybe<Scalars['ID']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
  text: Scalars['String']['input'];
};

export type CreatePermissionGroupInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreatePermissionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateQuizInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  lessonId: Scalars['ID']['input'];
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
  title: Scalars['String']['input'];
};

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateStudentProfileInput = {
  schoolYear: Scalars['Float']['input'];
  studentId: Scalars['Float']['input'];
};

export type CreateStyleCollectionInput = {
  name: Scalars['String']['input'];
};

export type CreateStyleGroupInput = {
  collectionId: Scalars['ID']['input'];
  element: PageElementType;
  name: Scalars['String']['input'];
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type CreateStyleInput = {
  collectionId: Scalars['ID']['input'];
  config: Scalars['JSONObject']['input'];
  element: PageElementType;
  groupId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type CreateSubjectInput = {
  name: Scalars['String']['input'];
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type CreateThemeInput = {
  defaultPaletteId: Scalars['ID']['input'];
  foundationTokens: Scalars['JSONObject']['input'];
  name: Scalars['String']['input'];
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
  semanticTokens: Scalars['JSONObject']['input'];
  styleCollectionId: Scalars['ID']['input'];
  version?: Scalars['Float']['input'];
};

export type CreateTopicInput = {
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

export type FindAllColorPaletteInput = {
  /** Set to true to return all records, ignoring pagination values */
  all?: InputMaybe<Scalars['Boolean']['input']>;
  collectionId?: InputMaybe<Scalars['ID']['input']>;
  /** Column/value pairs to filter by (records must satisfy **all** filters) */
  filters?: InputMaybe<Array<FilterInput>>;
  /** Maximum number of records to return */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of records to skip */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Names of relations to eager-load (e.g. ["keyStage", "author"]) */
  relations?: InputMaybe<Array<Scalars['String']['input']>>;
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

export type FindAllThemeInput = {
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
  styleCollectionId?: InputMaybe<Scalars['ID']['input']>;
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

export type LessonColumn = {
  __typename?: 'LessonColumn';
  items: Array<LessonElement>;
};

export type LessonColumnInput = {
  columnId: Scalars['String']['input'];
  items: Array<LessonElementInput>;
  spacing?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  wrapperStyles?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type LessonElement = {
  __typename?: 'LessonElement';
  animation?: Maybe<Scalars['JSONObject']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  questions?: Maybe<Scalars['JSONObject']['output']>;
  src?: Maybe<Scalars['String']['output']>;
  styleId?: Maybe<Scalars['ID']['output']>;
  styleOverrides?: Maybe<Scalars['JSONObject']['output']>;
  table?: Maybe<Scalars['JSONObject']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type: PageElementType;
  url?: Maybe<Scalars['String']['output']>;
  variantId?: Maybe<Scalars['ID']['output']>;
  wrapperStyles?: Maybe<Scalars['JSONObject']['output']>;
};

export type LessonElementInput = {
  animation?: InputMaybe<Scalars['JSONObject']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  questions?: InputMaybe<Scalars['JSONObject']['input']>;
  src?: InputMaybe<Scalars['String']['input']>;
  styleId?: InputMaybe<Scalars['ID']['input']>;
  styleOverrides?: InputMaybe<Scalars['JSONObject']['input']>;
  table?: InputMaybe<Scalars['JSONObject']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type: PageElementType;
  url?: InputMaybe<Scalars['String']['input']>;
  variantId?: InputMaybe<Scalars['ID']['input']>;
  wrapperStyles?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type LessonEntity = {
  __typename?: 'LessonEntity';
  content?: Maybe<Array<LessonSlide>>;
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<EducatorProfileDto>;
  createdById?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastThemeUpgrade?: Maybe<Scalars['DateTime']['output']>;
  multipleChoiceQuestions?: Maybe<Array<MultipleChoiceQuestionEntity>>;
  quizzes?: Maybe<Array<QuizEntity>>;
  recommendedYearGroups?: Maybe<Array<YearGroupEntity>>;
  subject: SubjectEntity;
  theme: ThemeEntity;
  themeId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  topic: TopicEntity;
  updatedAt: Scalars['DateTime']['output'];
};

export type LessonSlide = {
  __typename?: 'LessonSlide';
  columns: Array<LessonColumn>;
};

export type LessonSlideInput = {
  columns: Array<LessonColumnInput>;
  id: Scalars['String']['input'];
  title: Scalars['String']['input'];
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

export type MultipleChoiceQuestionEntity = {
  __typename?: 'MultipleChoiceQuestionEntity';
  correctAnswer: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lesson: LessonEntity;
  options: Array<Scalars['String']['output']>;
  quiz?: Maybe<QuizEntity>;
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create one Assignment */
  createAssignment: AssignmentEntity;
  /** Create one AssignmentSubmission */
  createAssignmentSubmission: AssignmentSubmissionEntity;
  /** Create one Class */
  createClass: ClassEntity;
  /** Create one ColorPalette */
  createColorPalette: ColorPaletteEntity;
  /** Create one ComponentVariant */
  createComponentVariant: ComponentVariantEntity;
  /** Create one EducatorProfile */
  createEducatorProfile: EducatorProfileDto;
  /** Create one KeyStage */
  createKeyStage: KeyStageEntity;
  /** Create one Lesson */
  createLesson: LessonEntity;
  /** Create one MultipleChoiceQuestion */
  createMultipleChoiceQuestion: MultipleChoiceQuestionEntity;
  /** Create one Permission */
  createPermission: Permission;
  /** Create one PermissionGroup */
  createPermissionGroup: PermissionGroup;
  /** Create one Quiz */
  createQuiz: QuizEntity;
  /** Create one Role */
  createRole: Role;
  /** Create one StudentProfile */
  createStudentProfile: StudentProfileDto;
  /** Create one Style */
  createStyle: StyleEntity;
  /** Create one StyleCollection */
  createStyleCollection: StyleCollectionEntity;
  /** Create one StyleGroup */
  createStyleGroup: StyleGroupEntity;
  /** Create one Subject */
  createSubject: SubjectEntity;
  /** Create one Theme */
  createTheme: ThemeEntity;
  /** Create one Topic */
  createTopic: TopicEntity;
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
  /** Delete one ColorPalette */
  deleteColorPalette: Scalars['Boolean']['output'];
  /** Delete one ComponentVariant */
  deleteComponentVariant: Scalars['Boolean']['output'];
  /** Delete one EducatorProfile */
  deleteEducatorProfile: Scalars['Boolean']['output'];
  /** Delete one KeyStage */
  deleteKeyStage: Scalars['Boolean']['output'];
  /** Delete one Lesson */
  deleteLesson: Scalars['Boolean']['output'];
  /** Delete one MultipleChoiceQuestion */
  deleteMultipleChoiceQuestion: Scalars['Boolean']['output'];
  /** Delete one Permission */
  deletePermission: Scalars['Boolean']['output'];
  /** Delete one PermissionGroup */
  deletePermissionGroup: Scalars['Boolean']['output'];
  /** Delete one Quiz */
  deleteQuiz: Scalars['Boolean']['output'];
  /** Delete one Role */
  deleteRole: Scalars['Boolean']['output'];
  /** Delete one StudentProfile */
  deleteStudentProfile: Scalars['Boolean']['output'];
  /** Delete one Style */
  deleteStyle: Scalars['Boolean']['output'];
  /** Delete one StyleCollection */
  deleteStyleCollection: Scalars['Boolean']['output'];
  /** Delete one StyleGroup */
  deleteStyleGroup: Scalars['Boolean']['output'];
  /** Delete one Subject */
  deleteSubject: Scalars['Boolean']['output'];
  /** Delete one Theme */
  deleteTheme: Scalars['Boolean']['output'];
  /** Delete one Topic */
  deleteTopic: Scalars['Boolean']['output'];
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
  /** Updates one ColorPalette */
  updateColorPalette: ColorPaletteEntity;
  /** Updates one ComponentVariant */
  updateComponentVariant: ComponentVariantEntity;
  /** Updates one EducatorProfile */
  updateEducatorProfile: EducatorProfileDto;
  /** Updates one KeyStage */
  updateKeyStage: KeyStageEntity;
  /** Updates one Lesson */
  updateLesson: LessonEntity;
  /** Updates one MultipleChoiceQuestion */
  updateMultipleChoiceQuestion: MultipleChoiceQuestionEntity;
  /** Updates one Permission */
  updatePermission: Permission;
  /** Updates one PermissionGroup */
  updatePermissionGroup: PermissionGroup;
  updatePermissionGroupPermissionsFromArray: PermissionGroup;
  updatePermissionGroupsForRole: Role;
  /** Updates one Quiz */
  updateQuiz: QuizEntity;
  /** Updates one Role */
  updateRole: Role;
  /** Updates one StudentProfile */
  updateStudentProfile: StudentProfileDto;
  /** Updates one Style */
  updateStyle: StyleEntity;
  /** Updates one StyleCollection */
  updateStyleCollection: StyleCollectionEntity;
  /** Updates one StyleGroup */
  updateStyleGroup: StyleGroupEntity;
  /** Updates one Subject */
  updateSubject: SubjectEntity;
  /** Updates one Theme */
  updateTheme: ThemeEntity;
  /** Updates one Topic */
  updateTopic: TopicEntity;
  updateUserByPublicId: User;
  updateUserRolesFromArray: User;
  /** Updates one YearGroup */
  updateYearGroup: YearGroupEntity;
  /** Upgrade the lesson's theme version */
  upgradeLessonTheme: LessonEntity;
  /** Upgrade a theme to a specific version */
  upgradeThemeVersion: ThemeEntity;
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


export type MutationCreateColorPaletteArgs = {
  data: CreateColorPaletteInput;
};


export type MutationCreateComponentVariantArgs = {
  data: CreateComponentVariantInput;
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


export type MutationCreateMultipleChoiceQuestionArgs = {
  data: CreateMultipleChoiceQuestionInput;
};


export type MutationCreatePermissionArgs = {
  data: CreatePermissionInput;
};


export type MutationCreatePermissionGroupArgs = {
  data: CreatePermissionGroupInput;
};


export type MutationCreateQuizArgs = {
  data: CreateQuizInput;
};


export type MutationCreateRoleArgs = {
  data: CreateRoleInput;
};


export type MutationCreateStudentProfileArgs = {
  data: CreateStudentProfileInput;
};


export type MutationCreateStyleArgs = {
  data: CreateStyleInput;
};


export type MutationCreateStyleCollectionArgs = {
  data: CreateStyleCollectionInput;
};


export type MutationCreateStyleGroupArgs = {
  data: CreateStyleGroupInput;
};


export type MutationCreateSubjectArgs = {
  data: CreateSubjectInput;
};


export type MutationCreateThemeArgs = {
  data: CreateThemeInput;
};


export type MutationCreateTopicArgs = {
  data: CreateTopicInput;
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


export type MutationDeleteColorPaletteArgs = {
  data: IdInput;
};


export type MutationDeleteComponentVariantArgs = {
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


export type MutationDeleteMultipleChoiceQuestionArgs = {
  data: IdInput;
};


export type MutationDeletePermissionArgs = {
  data: IdInput;
};


export type MutationDeletePermissionGroupArgs = {
  data: IdInput;
};


export type MutationDeleteQuizArgs = {
  data: IdInput;
};


export type MutationDeleteRoleArgs = {
  data: IdInput;
};


export type MutationDeleteStudentProfileArgs = {
  data: IdInput;
};


export type MutationDeleteStyleArgs = {
  data: IdInput;
};


export type MutationDeleteStyleCollectionArgs = {
  data: IdInput;
};


export type MutationDeleteStyleGroupArgs = {
  data: IdInput;
};


export type MutationDeleteSubjectArgs = {
  data: IdInput;
};


export type MutationDeleteThemeArgs = {
  data: IdInput;
};


export type MutationDeleteTopicArgs = {
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


export type MutationUpdateColorPaletteArgs = {
  data: UpdateColorPaletteInput;
};


export type MutationUpdateComponentVariantArgs = {
  data: UpdateComponentVariantInput;
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


export type MutationUpdateMultipleChoiceQuestionArgs = {
  data: UpdateMultipleChoiceQuestionInput;
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


export type MutationUpdateQuizArgs = {
  data: UpdateQuizInput;
};


export type MutationUpdateRoleArgs = {
  data: UpdateRoleInput;
};


export type MutationUpdateStudentProfileArgs = {
  data: UpdateStudentProfileInput;
};


export type MutationUpdateStyleArgs = {
  data: UpdateStyleInput;
};


export type MutationUpdateStyleCollectionArgs = {
  data: UpdateStyleCollectionInput;
};


export type MutationUpdateStyleGroupArgs = {
  data: UpdateStyleGroupInput;
};


export type MutationUpdateSubjectArgs = {
  data: UpdateSubjectInput;
};


export type MutationUpdateThemeArgs = {
  data: UpdateThemeInput;
};


export type MutationUpdateTopicArgs = {
  data: UpdateTopicInput;
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


export type MutationUpgradeLessonThemeArgs = {
  data: UpgradeLessonThemeInput;
};


export type MutationUpgradeThemeVersionArgs = {
  data: UpgradeThemeVersionInput;
};

export enum PageElementType {
  Image = 'Image',
  Quiz = 'Quiz',
  Table = 'Table',
  Text = 'Text',
  Video = 'Video'
}

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
  /** Returns all ColorPalette (optionally filtered) */
  getAllColorPalette: Array<ColorPaletteEntity>;
  /** Returns all ComponentVariant (optionally filtered) */
  getAllComponentVariant: Array<ComponentVariantEntity>;
  /** Returns all EducatorProfile (optionally filtered) */
  getAllEducatorProfile: Array<EducatorProfileDto>;
  /** Returns all KeyStage (optionally filtered) */
  getAllKeyStage: Array<KeyStageEntity>;
  /** Returns all Lesson (optionally filtered) */
  getAllLesson: Array<LessonEntity>;
  /** Returns all MultipleChoiceQuestion (optionally filtered) */
  getAllMultipleChoiceQuestion: Array<MultipleChoiceQuestionEntity>;
  /** Returns all Permission (optionally filtered) */
  getAllPermission: Array<Permission>;
  /** Returns all PermissionGroup (optionally filtered) */
  getAllPermissionGroup: Array<PermissionGroup>;
  /** Returns all Quiz (optionally filtered) */
  getAllQuiz: Array<QuizEntity>;
  /** Returns all Role (optionally filtered) */
  getAllRole: Array<Role>;
  /** Returns all StudentProfile (optionally filtered) */
  getAllStudentProfile: Array<StudentProfileDto>;
  /** Returns all Style (optionally filtered) */
  getAllStyle: Array<StyleEntity>;
  /** Returns all StyleCollection (optionally filtered) */
  getAllStyleCollection: Array<StyleCollectionEntity>;
  /** Returns all StyleGroup (optionally filtered) */
  getAllStyleGroup: Array<StyleGroupEntity>;
  /** Returns all Subject (optionally filtered) */
  getAllSubject: Array<SubjectEntity>;
  /** Returns all Theme (optionally filtered) */
  getAllTheme: Array<ThemeEntity>;
  /** Returns all Topic (optionally filtered) */
  getAllTopic: Array<TopicEntity>;
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
  /** Returns one ColorPalette */
  getColorPalette: ColorPaletteEntity;
  /** Returns one ComponentVariant */
  getComponentVariant: ComponentVariantEntity;
  /** Returns one ComponentVariant by given conditions */
  getComponentVariantBy: ComponentVariantEntity;
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
  /** Returns one MultipleChoiceQuestion */
  getMultipleChoiceQuestion: MultipleChoiceQuestionEntity;
  /** Returns one MultipleChoiceQuestion by given conditions */
  getMultipleChoiceQuestionBy: MultipleChoiceQuestionEntity;
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
  /** Returns one Quiz */
  getQuiz: QuizEntity;
  /** Returns one Quiz by given conditions */
  getQuizBy: QuizEntity;
  /** Returns one Role */
  getRole: Role;
  /** Returns one Role by given conditions */
  getRoleBy: Role;
  getRolesForUser: Array<Role>;
  /** Returns one StudentProfile */
  getStudentProfile: StudentProfileDto;
  /** Returns one StudentProfile by given conditions */
  getStudentProfileBy: StudentProfileDto;
  /** Returns one Style */
  getStyle: StyleEntity;
  /** Returns one Style by given conditions */
  getStyleBy: StyleEntity;
  /** Returns one StyleCollection */
  getStyleCollection: StyleCollectionEntity;
  /** Returns one StyleCollection by given conditions */
  getStyleCollectionBy: StyleCollectionEntity;
  /** Returns one StyleGroup */
  getStyleGroup: StyleGroupEntity;
  /** Returns one StyleGroup by given conditions */
  getStyleGroupBy: StyleGroupEntity;
  /** Returns one Subject */
  getSubject: SubjectEntity;
  /** Returns one Subject by given conditions */
  getSubjectBy: SubjectEntity;
  /** Returns one Theme */
  getTheme: ThemeEntity;
  /** Returns one Theme by given conditions */
  getThemeBy: ThemeEntity;
  /** Returns one Topic */
  getTopic: TopicEntity;
  /** Returns one Topic by given conditions */
  getTopicBy: TopicEntity;
  getUserByPublicId: User;
  getUsersRolesAndPermissions: RolesPermissionsResponse;
  /** Returns one YearGroup */
  getYearGroup: YearGroupEntity;
  /** Returns one YearGroup by given conditions */
  getYearGroupBy: YearGroupEntity;
  /** Search Assignment records by given columns */
  searchAssignment: Array<AssignmentEntity>;
  /** Search AssignmentSubmission records by given columns */
  searchAssignmentSubmission: Array<AssignmentSubmissionEntity>;
  /** Search Class records by given columns */
  searchClass: Array<ClassEntity>;
  /** Search ComponentVariant records by given columns */
  searchComponentVariant: Array<ComponentVariantEntity>;
  /** Search EducatorProfile records by given columns */
  searchEducatorProfile: Array<EducatorProfileDto>;
  /** Search KeyStage records by given columns */
  searchKeyStage: Array<KeyStageEntity>;
  /** Search Lesson records by given columns */
  searchLesson: Array<LessonEntity>;
  /** Search MultipleChoiceQuestion records by given columns */
  searchMultipleChoiceQuestion: Array<MultipleChoiceQuestionEntity>;
  /** Search Permission records by given columns */
  searchPermission: Array<Permission>;
  /** Search PermissionGroup records by given columns */
  searchPermissionGroup: Array<PermissionGroup>;
  /** Search Quiz records by given columns */
  searchQuiz: Array<QuizEntity>;
  /** Search Role records by given columns */
  searchRole: Array<Role>;
  /** Search StudentProfile records by given columns */
  searchStudentProfile: Array<StudentProfileDto>;
  /** Search Style records by given columns */
  searchStyle: Array<StyleEntity>;
  /** Search StyleCollection records by given columns */
  searchStyleCollection: Array<StyleCollectionEntity>;
  /** Search StyleGroup records by given columns */
  searchStyleGroup: Array<StyleGroupEntity>;
  /** Search Subject records by given columns */
  searchSubject: Array<SubjectEntity>;
  /** Search Theme records by given columns */
  searchTheme: Array<ThemeEntity>;
  /** Search Topic records by given columns */
  searchTopic: Array<TopicEntity>;
  searchUsers: Array<User>;
  /** Search YearGroup records by given columns */
  searchYearGroup: Array<YearGroupEntity>;
  topicsByYearAndSubject: Array<TopicEntity>;
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


export type QueryGetAllColorPaletteArgs = {
  data: FindAllColorPaletteInput;
};


export type QueryGetAllComponentVariantArgs = {
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


export type QueryGetAllMultipleChoiceQuestionArgs = {
  data: FindAllInput;
};


export type QueryGetAllPermissionArgs = {
  data: FindAllInput;
};


export type QueryGetAllPermissionGroupArgs = {
  data: FindAllInput;
};


export type QueryGetAllQuizArgs = {
  data: FindAllInput;
};


export type QueryGetAllRoleArgs = {
  data: FindAllInput;
};


export type QueryGetAllStudentProfileArgs = {
  data: FindAllInput;
};


export type QueryGetAllStyleArgs = {
  data: FindAllInput;
};


export type QueryGetAllStyleCollectionArgs = {
  data: FindAllInput;
};


export type QueryGetAllStyleGroupArgs = {
  data: FindAllInput;
};


export type QueryGetAllSubjectArgs = {
  data: FindAllInput;
};


export type QueryGetAllThemeArgs = {
  data: FindAllThemeInput;
};


export type QueryGetAllTopicArgs = {
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


export type QueryGetColorPaletteArgs = {
  data: IdInput;
};


export type QueryGetComponentVariantArgs = {
  data: IdInput;
};


export type QueryGetComponentVariantByArgs = {
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


export type QueryGetMultipleChoiceQuestionArgs = {
  data: IdInput;
};


export type QueryGetMultipleChoiceQuestionByArgs = {
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


export type QueryGetQuizArgs = {
  data: IdInput;
};


export type QueryGetQuizByArgs = {
  data: FindOneByInput;
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


export type QueryGetStyleArgs = {
  data: IdInput;
};


export type QueryGetStyleByArgs = {
  data: FindOneByInput;
};


export type QueryGetStyleCollectionArgs = {
  data: IdInput;
};


export type QueryGetStyleCollectionByArgs = {
  data: FindOneByInput;
};


export type QueryGetStyleGroupArgs = {
  data: IdInput;
};


export type QueryGetStyleGroupByArgs = {
  data: FindOneByInput;
};


export type QueryGetSubjectArgs = {
  data: IdInput;
};


export type QueryGetSubjectByArgs = {
  data: FindOneByInput;
};


export type QueryGetThemeArgs = {
  data: IdInput;
};


export type QueryGetThemeByArgs = {
  data: FindOneByInput;
};


export type QueryGetTopicArgs = {
  data: IdInput;
};


export type QueryGetTopicByArgs = {
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


export type QuerySearchAssignmentArgs = {
  data: SearchInput;
};


export type QuerySearchAssignmentSubmissionArgs = {
  data: SearchInput;
};


export type QuerySearchClassArgs = {
  data: SearchInput;
};


export type QuerySearchComponentVariantArgs = {
  data: SearchInput;
};


export type QuerySearchEducatorProfileArgs = {
  data: SearchInput;
};


export type QuerySearchKeyStageArgs = {
  data: SearchInput;
};


export type QuerySearchLessonArgs = {
  data: SearchInput;
};


export type QuerySearchMultipleChoiceQuestionArgs = {
  data: SearchInput;
};


export type QuerySearchPermissionArgs = {
  data: SearchInput;
};


export type QuerySearchPermissionGroupArgs = {
  data: SearchInput;
};


export type QuerySearchQuizArgs = {
  data: SearchInput;
};


export type QuerySearchRoleArgs = {
  data: SearchInput;
};


export type QuerySearchStudentProfileArgs = {
  data: SearchInput;
};


export type QuerySearchStyleArgs = {
  data: SearchInput;
};


export type QuerySearchStyleCollectionArgs = {
  data: SearchInput;
};


export type QuerySearchStyleGroupArgs = {
  data: SearchInput;
};


export type QuerySearchSubjectArgs = {
  data: SearchInput;
};


export type QuerySearchThemeArgs = {
  data: SearchInput;
};


export type QuerySearchTopicArgs = {
  data: SearchInput;
};


export type QuerySearchUsersArgs = {
  data: SearchInput;
};


export type QuerySearchYearGroupArgs = {
  data: SearchInput;
};


export type QueryTopicsByYearAndSubjectArgs = {
  input: TopicByYearSubjectInput;
};

export type QuizEntity = {
  __typename?: 'QuizEntity';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lesson: LessonEntity;
  multipleChoiceQuestions?: Maybe<Array<MultipleChoiceQuestionEntity>>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
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

export type SearchInput = {
  columns: Array<Scalars['String']['input']>;
  filters?: InputMaybe<Array<FilterInput>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  relations?: InputMaybe<Array<Scalars['String']['input']>>;
  search: Scalars['String']['input'];
};

export type StudentProfileDto = {
  __typename?: 'StudentProfileDto';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  schoolYear: Scalars['Float']['output'];
  studentId: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type StyleCollectionEntity = {
  __typename?: 'StyleCollectionEntity';
  colorPalettes?: Maybe<Array<ColorPaletteEntity>>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  styleGroups?: Maybe<Array<StyleGroupEntity>>;
  styles?: Maybe<Array<StyleEntity>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type StyleEntity = {
  __typename?: 'StyleEntity';
  collection: StyleCollectionEntity;
  collectionId: Scalars['ID']['output'];
  config: Scalars['JSONObject']['output'];
  createdAt: Scalars['DateTime']['output'];
  element: PageElementType;
  group?: Maybe<StyleGroupEntity>;
  groupId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type StyleGroupEntity = {
  __typename?: 'StyleGroupEntity';
  collection: StyleCollectionEntity;
  collectionId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  element: PageElementType;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  styles?: Maybe<Array<StyleEntity>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type SubjectEntity = {
  __typename?: 'SubjectEntity';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lessons?: Maybe<Array<LessonEntity>>;
  name: Scalars['String']['output'];
  topics?: Maybe<Array<TopicEntity>>;
  updatedAt: Scalars['DateTime']['output'];
  yearGroups?: Maybe<Array<YearGroupEntity>>;
};

export type SubmitIdArrayByIdRequestDto = {
  idArray: Array<Scalars['Int']['input']>;
  recordId: Scalars['Int']['input'];
};

export type ThemeEntity = {
  __typename?: 'ThemeEntity';
  componentVariants?: Maybe<Array<ComponentVariantEntity>>;
  createdAt: Scalars['DateTime']['output'];
  defaultPalette: ColorPaletteEntity;
  defaultPaletteId: Scalars['ID']['output'];
  foundationTokens: Scalars['JSONObject']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  semanticTokens: Scalars['JSONObject']['output'];
  styleCollection: StyleCollectionEntity;
  styleCollectionId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Float']['output'];
};

export type TopicByYearSubjectInput = {
  pagination?: InputMaybe<PaginationInput>;
  subjectId: Scalars['ID']['input'];
  withLessons?: Scalars['Boolean']['input'];
  yearGroupId: Scalars['ID']['input'];
};

export type TopicEntity = {
  __typename?: 'TopicEntity';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lessons?: Maybe<Array<LessonEntity>>;
  name: Scalars['String']['output'];
  subject: SubjectEntity;
  updatedAt: Scalars['DateTime']['output'];
  yearGroup: YearGroupEntity;
};

export type UpdateAssignmentInput = {
  classId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
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

export type UpdateColorPaletteInput = {
  collectionId?: InputMaybe<Scalars['ID']['input']>;
  colors?: InputMaybe<Array<PaletteColorInput>>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type UpdateComponentVariantInput = {
  accessibleName?: InputMaybe<Scalars['String']['input']>;
  baseComponent?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  props?: InputMaybe<Scalars['JSONObject']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
  themeId?: InputMaybe<Scalars['ID']['input']>;
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
  content?: InputMaybe<Array<LessonSlideInput>>;
  createdByEducatorId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  recommendedYearGroupIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
  themeId?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMultipleChoiceQuestionInput = {
  correctAnswer?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lessonId?: InputMaybe<Scalars['ID']['input']>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  quizId?: InputMaybe<Scalars['ID']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
  text?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateQuizInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lessonId?: InputMaybe<Scalars['ID']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
  title?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateStyleCollectionInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStyleGroupInput = {
  collectionId?: InputMaybe<Scalars['ID']['input']>;
  element?: InputMaybe<PageElementType>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type UpdateStyleInput = {
  collectionId?: InputMaybe<Scalars['ID']['input']>;
  config?: InputMaybe<Scalars['JSONObject']['input']>;
  element?: InputMaybe<PageElementType>;
  groupId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type UpdateSubjectInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
};

export type UpdateThemeInput = {
  defaultPaletteId?: InputMaybe<Scalars['ID']['input']>;
  foundationTokens?: InputMaybe<Scalars['JSONObject']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  /** Generic hook for attaching any relations by IDs */
  relationIds?: InputMaybe<Array<RelationIdsInput>>;
  semanticTokens?: InputMaybe<Scalars['JSONObject']['input']>;
  styleCollectionId?: InputMaybe<Scalars['ID']['input']>;
  version?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateTopicInput = {
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

export type UpgradeLessonThemeInput = {
  lessonId: Scalars['ID']['input'];
  version: Scalars['Float']['input'];
};

export type UpgradeThemeVersionInput = {
  id: Scalars['ID']['input'];
  version: Scalars['Float']['input'];
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
  topics?: Maybe<Array<TopicEntity>>;
  updatedAt: Scalars['DateTime']['output'];
  year: ValidYear;
};
