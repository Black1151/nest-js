// /**
//  * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
//  */

// import { type ScalarsEnumsHash } from "gqty";

// export type Maybe<T> = T | null;
// export type InputMaybe<T> = Maybe<T>;
// export type Exact<T extends { [key: string]: unknown }> = {
//   [K in keyof T]: T[K];
// };
// export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
//   [SubKey in K]?: Maybe<T[SubKey]>;
// };
// export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
//   [SubKey in K]: Maybe<T[SubKey]>;
// };
// export type MakeEmpty<
//   T extends { [key: string]: unknown },
//   K extends keyof T
// > = { [_ in K]?: never };
// export type Incremental<T> =
//   | T
//   | {
//       [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
//     };
// /** All built-in and custom scalars, mapped to their actual values */
// export interface Scalars {
//   ID: { input: string; output: string };
//   String: { input: string; output: string };
//   Boolean: { input: boolean; output: boolean };
//   Int: { input: number; output: number };
//   Float: { input: number; output: number };
//   /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
//   DateTime: { input: string; output: string };
// }

// export interface CreateAssignmentInput {
//   classId: Scalars["ID"]["input"];
//   description?: InputMaybe<Scalars["String"]["input"]>;
//   dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
//   lessonId: Scalars["ID"]["input"];
//   title: Scalars["String"]["input"];
// }

// export interface CreateAssignmentSubmissionInput {
//   assignmentId: Scalars["ID"]["input"];
//   feedback?: InputMaybe<Scalars["String"]["input"]>;
//   grade?: InputMaybe<Scalars["String"]["input"]>;
//   studentId: Scalars["ID"]["input"];
//   submissionContent?: InputMaybe<Scalars["String"]["input"]>;
//   submittedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
// }

// export interface CreateClassInput {
//   educatorIds?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
//   name: Scalars["String"]["input"];
//   studentIds?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
//   subjectId?: InputMaybe<Scalars["ID"]["input"]>;
//   yearGroupId?: InputMaybe<Scalars["ID"]["input"]>;
// }

// export interface CreateEducatorProfileInput {
//   staffId: Scalars["Float"]["input"];
// }

// export interface CreateKeyStageInput {
//   description?: InputMaybe<Scalars["String"]["input"]>;
//   name: Scalars["String"]["input"];
// }

// export interface CreateLessonInput {
//   content?: InputMaybe<Scalars["String"]["input"]>;
//   createdByEducatorId?: InputMaybe<Scalars["ID"]["input"]>;
//   recommendedYearGroupIds?: InputMaybe<
//     Array<InputMaybe<Scalars["ID"]["input"]>>
//   >;
//   subjectId?: InputMaybe<Scalars["ID"]["input"]>;
//   title: Scalars["String"]["input"];
// }

// export interface CreatePermissionGroupInput {
//   description: Scalars["String"]["input"];
//   name: Scalars["String"]["input"];
// }

// export interface CreatePermissionInput {
//   description?: InputMaybe<Scalars["String"]["input"]>;
//   name: Scalars["String"]["input"];
// }

// export interface CreateRoleInput {
//   description?: InputMaybe<Scalars["String"]["input"]>;
//   name: Scalars["String"]["input"];
// }

// export interface CreateStudentProfileInput {
//   schoolYear: Scalars["Float"]["input"];
//   studentId: Scalars["Float"]["input"];
// }

// export interface CreateSubjectInput {
//   name: Scalars["String"]["input"];
//   /** Generic hook for attaching any relations by IDs */
//   relationIds?: InputMaybe<Array<RelationIdsInput>>;
// }

// export interface CreateUserRequestDto {
//   addressLine1?: InputMaybe<Scalars["String"]["input"]>;
//   addressLine2?: InputMaybe<Scalars["String"]["input"]>;
//   city?: InputMaybe<Scalars["String"]["input"]>;
//   country?: InputMaybe<Scalars["String"]["input"]>;
//   county?: InputMaybe<Scalars["String"]["input"]>;
//   dateOfBirth?: InputMaybe<Scalars["DateTime"]["input"]>;
//   email: Scalars["String"]["input"];
//   firstName: Scalars["String"]["input"];
//   lastName: Scalars["String"]["input"];
//   password: Scalars["String"]["input"];
//   phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
//   postalCode?: InputMaybe<Scalars["String"]["input"]>;
//   userType: Scalars["String"]["input"];
// }

// export interface CreateUserWithProfileInput {
//   addressLine1?: InputMaybe<Scalars["String"]["input"]>;
//   addressLine2?: InputMaybe<Scalars["String"]["input"]>;
//   city?: InputMaybe<Scalars["String"]["input"]>;
//   country?: InputMaybe<Scalars["String"]["input"]>;
//   county?: InputMaybe<Scalars["String"]["input"]>;
//   dateOfBirth?: InputMaybe<Scalars["DateTime"]["input"]>;
//   educatorProfile?: InputMaybe<CreateEducatorProfileInput>;
//   email: Scalars["String"]["input"];
//   firstName: Scalars["String"]["input"];
//   lastName: Scalars["String"]["input"];
//   password: Scalars["String"]["input"];
//   phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
//   postalCode?: InputMaybe<Scalars["String"]["input"]>;
//   studentProfile?: InputMaybe<CreateStudentProfileInput>;
//   userType: Scalars["String"]["input"];
// }

// export interface CreateYearGroupInput {
//   keyStageId?: InputMaybe<Scalars["ID"]["input"]>;
//   year: ValidYear;
// }

// export interface FilterInput {
//   /** Column (property) name to filter on */
//   column: Scalars["String"]["input"];
//   /** Exact value the column must equal */
//   value: Scalars["String"]["input"];
// }

// export interface FindAllInput {
//   /** Set to true to return all records, ignoring pagination values */
//   all?: InputMaybe<Scalars["Boolean"]["input"]>;
//   /** Column/value pairs to filter by (records must satisfy **all** filters) */
//   filters?: InputMaybe<Array<FilterInput>>;
//   /** Maximum number of records to return */
//   limit?: InputMaybe<Scalars["Int"]["input"]>;
//   /** Number of records to skip */
//   offset?: InputMaybe<Scalars["Int"]["input"]>;
//   /** Names of relations to eager-load (e.g. ["keyStage", "author"]) */
//   relations?: InputMaybe<Array<Scalars["String"]["input"]>>;
// }

// export interface FindOneByInput {
//   column: Scalars["String"]["input"];
//   /** Relations to eager-load with this single record */
//   relations?: InputMaybe<Array<Scalars["String"]["input"]>>;
//   value: Scalars["String"]["input"];
// }

// export interface IdInput {
//   id: Scalars["Int"]["input"];
//   /** Relations to eager-load with this single record */
//   relations?: InputMaybe<Array<Scalars["String"]["input"]>>;
// }

// export interface IdRequestDto {
//   id: Scalars["Int"]["input"];
// }

// export interface LoginRequest {
//   email: Scalars["String"]["input"];
//   password: Scalars["String"]["input"];
// }

// export interface PaginatedGetAllRequestDto {
//   limit?: InputMaybe<Scalars["Int"]["input"]>;
//   offset?: InputMaybe<Scalars["Int"]["input"]>;
// }

// export interface PublicIdRequestDto {
//   publicId: Scalars["String"]["input"];
// }

// export interface RelationIdsInput {
//   /** IDs to link */
//   ids: Array<Scalars["Int"]["input"]>;
//   /** Relation name, exactly as on the entity (e.g. "yearGroups") */
//   relation: Scalars["String"]["input"];
// }

// export interface SubmitIdArrayByIdRequestDto {
//   idArray: Array<Scalars["Int"]["input"]>;
//   recordId: Scalars["Int"]["input"];
// }

// export interface UpdateAssignmentInput {
//   classId?: InputMaybe<Scalars["ID"]["input"]>;
//   description?: InputMaybe<Scalars["String"]["input"]>;
//   dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
//   id: Scalars["ID"]["input"];
//   lessonId?: InputMaybe<Scalars["ID"]["input"]>;
//   title?: InputMaybe<Scalars["String"]["input"]>;
// }

// export interface UpdateAssignmentSubmissionInput {
//   assignmentId?: InputMaybe<Scalars["ID"]["input"]>;
//   feedback?: InputMaybe<Scalars["String"]["input"]>;
//   grade?: InputMaybe<Scalars["String"]["input"]>;
//   id: Scalars["ID"]["input"];
//   studentId?: InputMaybe<Scalars["ID"]["input"]>;
//   submissionContent?: InputMaybe<Scalars["String"]["input"]>;
//   submittedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
// }

// export interface UpdateClassInput {
//   educatorIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
//   id: Scalars["ID"]["input"];
//   name?: InputMaybe<Scalars["String"]["input"]>;
//   studentIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
//   subjectId?: InputMaybe<Scalars["ID"]["input"]>;
//   yearGroupId?: InputMaybe<Scalars["ID"]["input"]>;
// }

// export interface UpdateEducatorProfileInput {
//   id: Scalars["Int"]["input"];
//   staffId?: InputMaybe<Scalars["Float"]["input"]>;
// }

// export interface UpdateKeyStageInput {
//   description?: InputMaybe<Scalars["String"]["input"]>;
//   id: Scalars["ID"]["input"];
//   name?: InputMaybe<Scalars["String"]["input"]>;
// }

// export interface UpdateLessonInput {
//   content?: InputMaybe<Scalars["String"]["input"]>;
//   createdByEducatorId?: InputMaybe<Scalars["ID"]["input"]>;
//   id: Scalars["ID"]["input"];
//   recommendedYearGroupIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
//   subjectId?: InputMaybe<Scalars["ID"]["input"]>;
//   title?: InputMaybe<Scalars["String"]["input"]>;
// }

// export interface UpdatePermissionGroupInput {
//   description?: InputMaybe<Scalars["String"]["input"]>;
//   id: Scalars["Int"]["input"];
//   name?: InputMaybe<Scalars["String"]["input"]>;
// }

// export interface UpdatePermissionInput {
//   description?: InputMaybe<Scalars["String"]["input"]>;
//   id: Scalars["Int"]["input"];
//   name?: InputMaybe<Scalars["String"]["input"]>;
// }

// export interface UpdateRoleInput {
//   description?: InputMaybe<Scalars["String"]["input"]>;
//   id: Scalars["Int"]["input"];
//   name?: InputMaybe<Scalars["String"]["input"]>;
// }

// export interface UpdateStudentProfileInput {
//   id: Scalars["Int"]["input"];
//   schoolYear?: InputMaybe<Scalars["Float"]["input"]>;
//   studentId?: InputMaybe<Scalars["Float"]["input"]>;
// }

// export interface UpdateSubjectInput {
//   id: Scalars["ID"]["input"];
//   name?: InputMaybe<Scalars["String"]["input"]>;
//   /** Generic hook for attaching any relations by IDs */
//   relationIds?: InputMaybe<Array<RelationIdsInput>>;
// }

// export interface UpdateUserRequestDto {
//   addressLine1?: InputMaybe<Scalars["String"]["input"]>;
//   addressLine2?: InputMaybe<Scalars["String"]["input"]>;
//   city?: InputMaybe<Scalars["String"]["input"]>;
//   country?: InputMaybe<Scalars["String"]["input"]>;
//   county?: InputMaybe<Scalars["String"]["input"]>;
//   dateOfBirth?: InputMaybe<Scalars["DateTime"]["input"]>;
//   email: Scalars["String"]["input"];
//   firstName: Scalars["String"]["input"];
//   lastName: Scalars["String"]["input"];
//   phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
//   postalCode?: InputMaybe<Scalars["String"]["input"]>;
//   publicId: Scalars["String"]["input"];
//   userType: Scalars["String"]["input"];
// }

// export interface UpdateUserRolesFromArrayRequestDto {
//   publicId: Scalars["String"]["input"];
//   roleIds: Array<Scalars["Int"]["input"]>;
// }

// export interface UpdateYearGroupInput {
//   id: Scalars["ID"]["input"];
//   keyStageId?: InputMaybe<Scalars["ID"]["input"]>;
//   year?: InputMaybe<ValidYear>;
// }

// export interface UserPermissionsInput {
//   publicId: Scalars["String"]["input"];
// }

// /** National Curriculum Key Stage (3, 4 or 5) */
// export enum ValidKeyStage {
//   KS3 = "KS3",
//   KS4 = "KS4",
//   KS5 = "KS5",
// }

// export enum ValidYear {
//   Year7 = "Year7",
//   Year8 = "Year8",
//   Year9 = "Year9",
//   Year10 = "Year10",
//   Year11 = "Year11",
//   Year12 = "Year12",
//   Year13 = "Year13",
// }

// export const scalarsEnumsHash: ScalarsEnumsHash = {
//   Boolean: true,
//   DateTime: true,
//   Float: true,
//   ID: true,
//   Int: true,
//   String: true,
//   ValidKeyStage: true,
//   ValidYear: true,
// };
// export const generatedSchema = {
//   AssignmentEntity: {
//     __typename: { __type: "String!" },
//     class: { __type: "ClassEntity!" },
//     createdAt: { __type: "DateTime!" },
//     description: { __type: "String" },
//     dueDate: { __type: "DateTime" },
//     id: { __type: "ID!" },
//     lesson: { __type: "LessonEntity!" },
//     title: { __type: "String!" },
//     updatedAt: { __type: "DateTime!" },
//   },
//   AssignmentSubmissionEntity: {
//     __typename: { __type: "String!" },
//     assignment: { __type: "AssignmentEntity!" },
//     createdAt: { __type: "DateTime!" },
//     feedback: { __type: "String" },
//     grade: { __type: "String" },
//     id: { __type: "ID!" },
//     student: { __type: "StudentProfileDto!" },
//     submissionContent: { __type: "String" },
//     submittedAt: { __type: "DateTime" },
//     updatedAt: { __type: "DateTime!" },
//   },
//   AuthTokens: {
//     __typename: { __type: "String!" },
//     accessToken: { __type: "String!" },
//     refreshToken: { __type: "String!" },
//   },
//   ClassEntity: {
//     __typename: { __type: "String!" },
//     createdAt: { __type: "DateTime!" },
//     educators: { __type: "[EducatorProfileDto!]" },
//     id: { __type: "ID!" },
//     name: { __type: "String!" },
//     students: { __type: "[StudentProfileDto!]" },
//     subject: { __type: "SubjectEntity" },
//     updatedAt: { __type: "DateTime!" },
//     yearGroup: { __type: "YearGroupEntity" },
//   },
//   CreateAssignmentInput: {
//     classId: { __type: "ID!" },
//     description: { __type: "String" },
//     dueDate: { __type: "DateTime" },
//     lessonId: { __type: "ID!" },
//     title: { __type: "String!" },
//   },
//   CreateAssignmentSubmissionInput: {
//     assignmentId: { __type: "ID!" },
//     feedback: { __type: "String" },
//     grade: { __type: "String" },
//     studentId: { __type: "ID!" },
//     submissionContent: { __type: "String" },
//     submittedAt: { __type: "DateTime" },
//   },
//   CreateClassInput: {
//     educatorIds: { __type: "[ID]" },
//     name: { __type: "String!" },
//     studentIds: { __type: "[ID]" },
//     subjectId: { __type: "ID" },
//     yearGroupId: { __type: "ID" },
//   },
//   CreateEducatorProfileInput: { staffId: { __type: "Float!" } },
//   CreateKeyStageInput: {
//     description: { __type: "String" },
//     name: { __type: "String!" },
//   },
//   CreateLessonInput: {
//     content: { __type: "String" },
//     createdByEducatorId: { __type: "ID" },
//     recommendedYearGroupIds: { __type: "[ID]" },
//     subjectId: { __type: "ID" },
//     title: { __type: "String!" },
//   },
//   CreatePermissionGroupInput: {
//     description: { __type: "String!" },
//     name: { __type: "String!" },
//   },
//   CreatePermissionInput: {
//     description: { __type: "String" },
//     name: { __type: "String!" },
//   },
//   CreateRoleInput: {
//     description: { __type: "String" },
//     name: { __type: "String!" },
//   },
//   CreateStudentProfileInput: {
//     schoolYear: { __type: "Float!" },
//     studentId: { __type: "Float!" },
//   },
//   CreateSubjectInput: {
//     name: { __type: "String!" },
//     relationIds: { __type: "[RelationIdsInput!]" },
//   },
//   CreateUserRequestDto: {
//     addressLine1: { __type: "String" },
//     addressLine2: { __type: "String" },
//     city: { __type: "String" },
//     country: { __type: "String" },
//     county: { __type: "String" },
//     dateOfBirth: { __type: "DateTime" },
//     email: { __type: "String!" },
//     firstName: { __type: "String!" },
//     lastName: { __type: "String!" },
//     password: { __type: "String!" },
//     phoneNumber: { __type: "String" },
//     postalCode: { __type: "String" },
//     userType: { __type: "String!" },
//   },
//   CreateUserWithProfileInput: {
//     addressLine1: { __type: "String" },
//     addressLine2: { __type: "String" },
//     city: { __type: "String" },
//     country: { __type: "String" },
//     county: { __type: "String" },
//     dateOfBirth: { __type: "DateTime" },
//     educatorProfile: { __type: "CreateEducatorProfileInput" },
//     email: { __type: "String!" },
//     firstName: { __type: "String!" },
//     lastName: { __type: "String!" },
//     password: { __type: "String!" },
//     phoneNumber: { __type: "String" },
//     postalCode: { __type: "String" },
//     studentProfile: { __type: "CreateStudentProfileInput" },
//     userType: { __type: "String!" },
//   },
//   CreateYearGroupInput: {
//     keyStageId: { __type: "ID" },
//     year: { __type: "ValidYear!" },
//   },
//   EducatorProfileDto: {
//     __typename: { __type: "String!" },
//     createdAt: { __type: "DateTime!" },
//     id: { __type: "ID!" },
//     staffId: { __type: "Float!" },
//     updatedAt: { __type: "DateTime!" },
//   },
//   FilterInput: { column: { __type: "String!" }, value: { __type: "String!" } },
//   FindAllInput: {
//     all: { __type: "Boolean" },
//     filters: { __type: "[FilterInput!]" },
//     limit: { __type: "Int" },
//     offset: { __type: "Int" },
//     relations: { __type: "[String!]" },
//   },
//   FindOneByInput: {
//     column: { __type: "String!" },
//     relations: { __type: "[String!]" },
//     value: { __type: "String!" },
//   },
//   IdInput: { id: { __type: "Int!" }, relations: { __type: "[String!]" } },
//   IdRequestDto: { id: { __type: "Int!" } },
//   KeyStageEntity: {
//     __typename: { __type: "String!" },
//     createdAt: { __type: "DateTime!" },
//     description: { __type: "String" },
//     id: { __type: "ID!" },
//     name: { __type: "String" },
//     stage: { __type: "ValidKeyStage!" },
//     updatedAt: { __type: "DateTime!" },
//     yearGroups: { __type: "[YearGroupEntity!]!" },
//   },
//   LessonEntity: {
//     __typename: { __type: "String!" },
//     content: { __type: "String" },
//     createdAt: { __type: "DateTime!" },
//     createdBy: { __type: "EducatorProfileDto" },
//     createdById: { __type: "ID" },
//     id: { __type: "ID!" },
//     recommendedYearGroups: { __type: "[YearGroupEntity!]" },
//     subject: { __type: "SubjectEntity" },
//     title: { __type: "String!" },
//     updatedAt: { __type: "DateTime!" },
//   },
//   LoginRequest: {
//     email: { __type: "String!" },
//     password: { __type: "String!" },
//   },
//   LoginResponse: {
//     __typename: { __type: "String!" },
//     accessToken: { __type: "String!" },
//     refreshToken: { __type: "String!" },
//     userDetails: { __type: "UserDetails!" },
//   },
//   PaginatedGetAllRequestDto: {
//     limit: { __type: "Int" },
//     offset: { __type: "Int" },
//   },
//   Permission: {
//     __typename: { __type: "String!" },
//     createdAt: { __type: "DateTime!" },
//     description: { __type: "String" },
//     id: { __type: "ID!" },
//     name: { __type: "String!" },
//     permissionGroups: { __type: "[PermissionGroup!]" },
//     roles: { __type: "[Role!]" },
//     updatedAt: { __type: "DateTime!" },
//   },
//   PermissionDTO: {
//     __typename: { __type: "String!" },
//     createdAt: { __type: "DateTime!" },
//     id: { __type: "Float!" },
//     name: { __type: "String!" },
//     updatedAt: { __type: "DateTime!" },
//   },
//   PermissionGroup: {
//     __typename: { __type: "String!" },
//     createdAt: { __type: "DateTime!" },
//     description: { __type: "String!" },
//     id: { __type: "ID!" },
//     name: { __type: "String!" },
//     permissions: { __type: "[Permission!]" },
//     roles: { __type: "[Role!]" },
//     updatedAt: { __type: "DateTime!" },
//   },
//   PublicIdRequestDto: { publicId: { __type: "String!" } },
//   RelationIdsInput: {
//     ids: { __type: "[Int!]!" },
//     relation: { __type: "String!" },
//   },
//   Role: {
//     __typename: { __type: "String!" },
//     createdAt: { __type: "DateTime!" },
//     description: { __type: "String!" },
//     id: { __type: "ID!" },
//     name: { __type: "String!" },
//     permissionGroups: { __type: "[PermissionGroup!]" },
//     permissions: { __type: "[Permission!]" },
//     updatedAt: { __type: "DateTime!" },
//   },
//   RoleDTO: {
//     __typename: { __type: "String!" },
//     createdAt: { __type: "DateTime!" },
//     id: { __type: "Float!" },
//     name: { __type: "String!" },
//     updatedAt: { __type: "DateTime!" },
//   },
//   RolesPermissionsResponse: {
//     __typename: { __type: "String!" },
//     permissions: { __type: "[PermissionDTO!]!" },
//     roles: { __type: "[RoleDTO!]!" },
//   },
//   StudentProfileDto: {
//     __typename: { __type: "String!" },
//     createdAt: { __type: "DateTime!" },
//     id: { __type: "ID!" },
//     schoolYear: { __type: "Float!" },
//     studentId: { __type: "Float!" },
//     updatedAt: { __type: "DateTime!" },
//   },
//   SubjectEntity: {
//     __typename: { __type: "String!" },
//     createdAt: { __type: "DateTime!" },
//     id: { __type: "ID!" },
//     name: { __type: "String!" },
//     updatedAt: { __type: "DateTime!" },
//     yearGroups: { __type: "[YearGroupEntity!]" },
//   },
//   SubmitIdArrayByIdRequestDto: {
//     idArray: { __type: "[Int!]!" },
//     recordId: { __type: "Int!" },
//   },
//   UpdateAssignmentInput: {
//     classId: { __type: "ID" },
//     description: { __type: "String" },
//     dueDate: { __type: "DateTime" },
//     id: { __type: "ID!" },
//     lessonId: { __type: "ID" },
//     title: { __type: "String" },
//   },
//   UpdateAssignmentSubmissionInput: {
//     assignmentId: { __type: "ID" },
//     feedback: { __type: "String" },
//     grade: { __type: "String" },
//     id: { __type: "ID!" },
//     studentId: { __type: "ID" },
//     submissionContent: { __type: "String" },
//     submittedAt: { __type: "DateTime" },
//   },
//   UpdateClassInput: {
//     educatorIds: { __type: "[ID!]" },
//     id: { __type: "ID!" },
//     name: { __type: "String" },
//     studentIds: { __type: "[ID!]" },
//     subjectId: { __type: "ID" },
//     yearGroupId: { __type: "ID" },
//   },
//   UpdateEducatorProfileInput: {
//     id: { __type: "Int!" },
//     staffId: { __type: "Float" },
//   },
//   UpdateKeyStageInput: {
//     description: { __type: "String" },
//     id: { __type: "ID!" },
//     name: { __type: "String" },
//   },
//   UpdateLessonInput: {
//     content: { __type: "String" },
//     createdByEducatorId: { __type: "ID" },
//     id: { __type: "ID!" },
//     recommendedYearGroupIds: { __type: "[ID!]" },
//     subjectId: { __type: "ID" },
//     title: { __type: "String" },
//   },
//   UpdatePermissionGroupInput: {
//     description: { __type: "String" },
//     id: { __type: "Int!" },
//     name: { __type: "String" },
//   },
//   UpdatePermissionInput: {
//     description: { __type: "String" },
//     id: { __type: "Int!" },
//     name: { __type: "String" },
//   },
//   UpdateRoleInput: {
//     description: { __type: "String" },
//     id: { __type: "Int!" },
//     name: { __type: "String" },
//   },
//   UpdateStudentProfileInput: {
//     id: { __type: "Int!" },
//     schoolYear: { __type: "Float" },
//     studentId: { __type: "Float" },
//   },
//   UpdateSubjectInput: {
//     id: { __type: "ID!" },
//     name: { __type: "String" },
//     relationIds: { __type: "[RelationIdsInput!]" },
//   },
//   UpdateUserRequestDto: {
//     addressLine1: { __type: "String" },
//     addressLine2: { __type: "String" },
//     city: { __type: "String" },
//     country: { __type: "String" },
//     county: { __type: "String" },
//     dateOfBirth: { __type: "DateTime" },
//     email: { __type: "String!" },
//     firstName: { __type: "String!" },
//     lastName: { __type: "String!" },
//     phoneNumber: { __type: "String" },
//     postalCode: { __type: "String" },
//     publicId: { __type: "String!" },
//     userType: { __type: "String!" },
//   },
//   UpdateUserRolesFromArrayRequestDto: {
//     publicId: { __type: "String!" },
//     roleIds: { __type: "[Int!]!" },
//   },
//   UpdateYearGroupInput: {
//     id: { __type: "ID!" },
//     keyStageId: { __type: "ID" },
//     year: { __type: "ValidYear" },
//   },
//   User: {
//     __typename: { __type: "String!" },
//     addressLine1: { __type: "String" },
//     addressLine2: { __type: "String" },
//     city: { __type: "String" },
//     country: { __type: "String" },
//     county: { __type: "String" },
//     createdAt: { __type: "DateTime!" },
//     dateOfBirth: { __type: "DateTime" },
//     educatorProfile: { __type: "EducatorProfileDto" },
//     email: { __type: "String!" },
//     firstName: { __type: "String!" },
//     id: { __type: "ID!" },
//     lastName: { __type: "String!" },
//     phoneNumber: { __type: "String" },
//     postalCode: { __type: "String" },
//     publicId: { __type: "String!" },
//     roles: { __type: "[Role!]" },
//     studentProfile: { __type: "StudentProfileDto" },
//     updatedAt: { __type: "DateTime!" },
//     userType: { __type: "String!" },
//   },
//   UserDetails: {
//     __typename: { __type: "String!" },
//     permissions: { __type: "[String!]!" },
//     publicId: { __type: "String!" },
//   },
//   UserPermissionsInput: { publicId: { __type: "String!" } },
//   YearGroupEntity: {
//     __typename: { __type: "String!" },
//     createdAt: { __type: "DateTime!" },
//     id: { __type: "ID!" },
//     keyStage: { __type: "KeyStageEntity" },
//     subjects: { __type: "[SubjectEntity!]" },
//     updatedAt: { __type: "DateTime!" },
//     year: { __type: "ValidYear!" },
//   },
//   mutation: {
//     __typename: { __type: "String!" },
//     createAssignment: {
//       __type: "AssignmentEntity!",
//       __args: { data: "CreateAssignmentInput!" },
//     },
//     createAssignmentSubmission: {
//       __type: "AssignmentSubmissionEntity!",
//       __args: { data: "CreateAssignmentSubmissionInput!" },
//     },
//     createClass: {
//       __type: "ClassEntity!",
//       __args: { data: "CreateClassInput!" },
//     },
//     createEducatorProfile: {
//       __type: "EducatorProfileDto!",
//       __args: { data: "CreateEducatorProfileInput!" },
//     },
//     createKeyStage: {
//       __type: "KeyStageEntity!",
//       __args: { data: "CreateKeyStageInput!" },
//     },
//     createLesson: {
//       __type: "LessonEntity!",
//       __args: { data: "CreateLessonInput!" },
//     },
//     createPermission: {
//       __type: "Permission!",
//       __args: { data: "CreatePermissionInput!" },
//     },
//     createPermissionGroup: {
//       __type: "PermissionGroup!",
//       __args: { data: "CreatePermissionGroupInput!" },
//     },
//     createRole: { __type: "Role!", __args: { data: "CreateRoleInput!" } },
//     createStudentProfile: {
//       __type: "StudentProfileDto!",
//       __args: { data: "CreateStudentProfileInput!" },
//     },
//     createSubject: {
//       __type: "SubjectEntity!",
//       __args: { data: "CreateSubjectInput!" },
//     },
//     createUser: { __type: "User!", __args: { data: "CreateUserRequestDto!" } },
//     createUserWithProfile: {
//       __type: "User!",
//       __args: { data: "CreateUserWithProfileInput!" },
//     },
//     createYearGroup: {
//       __type: "YearGroupEntity!",
//       __args: { data: "CreateYearGroupInput!" },
//     },
//     deleteAssignment: { __type: "Boolean!", __args: { data: "IdInput!" } },
//     deleteAssignmentSubmission: {
//       __type: "Boolean!",
//       __args: { data: "IdInput!" },
//     },
//     deleteClass: { __type: "Boolean!", __args: { data: "IdInput!" } },
//     deleteEducatorProfile: { __type: "Boolean!", __args: { data: "IdInput!" } },
//     deleteKeyStage: { __type: "Boolean!", __args: { data: "IdInput!" } },
//     deleteLesson: { __type: "Boolean!", __args: { data: "IdInput!" } },
//     deletePermission: { __type: "Boolean!", __args: { data: "IdInput!" } },
//     deletePermissionGroup: { __type: "Boolean!", __args: { data: "IdInput!" } },
//     deleteRole: { __type: "Boolean!", __args: { data: "IdInput!" } },
//     deleteStudentProfile: { __type: "Boolean!", __args: { data: "IdInput!" } },
//     deleteSubject: { __type: "Boolean!", __args: { data: "IdInput!" } },
//     deleteYearGroup: { __type: "Boolean!", __args: { data: "IdInput!" } },
//     logUserInWithEmailAndPassword: {
//       __type: "AuthTokens!",
//       __args: { data: "LoginRequest!" },
//     },
//     refreshUsersTokens: {
//       __type: "LoginResponse!",
//       __args: { refreshToken: "String!" },
//     },
//     registerNewUserLocally: {
//       __type: "User!",
//       __args: { data: "CreateUserRequestDto!" },
//     },
//     removeUserByPublicId: {
//       __type: "User!",
//       __args: { data: "PublicIdRequestDto!" },
//     },
//     updateAssignment: {
//       __type: "AssignmentEntity!",
//       __args: { data: "UpdateAssignmentInput!" },
//     },
//     updateAssignmentSubmission: {
//       __type: "AssignmentSubmissionEntity!",
//       __args: { data: "UpdateAssignmentSubmissionInput!" },
//     },
//     updateClass: {
//       __type: "ClassEntity!",
//       __args: { data: "UpdateClassInput!" },
//     },
//     updateEducatorProfile: {
//       __type: "EducatorProfileDto!",
//       __args: { data: "UpdateEducatorProfileInput!" },
//     },
//     updateKeyStage: {
//       __type: "KeyStageEntity!",
//       __args: { data: "UpdateKeyStageInput!" },
//     },
//     updateLesson: {
//       __type: "LessonEntity!",
//       __args: { data: "UpdateLessonInput!" },
//     },
//     updatePermission: {
//       __type: "Permission!",
//       __args: { data: "UpdatePermissionInput!" },
//     },
//     updatePermissionGroup: {
//       __type: "PermissionGroup!",
//       __args: { data: "UpdatePermissionGroupInput!" },
//     },
//     updatePermissionGroupPermissionsFromArray: {
//       __type: "PermissionGroup!",
//       __args: { data: "SubmitIdArrayByIdRequestDto!" },
//     },
//     updatePermissionGroupsForRole: {
//       __type: "Role!",
//       __args: { data: "SubmitIdArrayByIdRequestDto!" },
//     },
//     updateRole: { __type: "Role!", __args: { data: "UpdateRoleInput!" } },
//     updateStudentProfile: {
//       __type: "StudentProfileDto!",
//       __args: { data: "UpdateStudentProfileInput!" },
//     },
//     updateSubject: {
//       __type: "SubjectEntity!",
//       __args: { data: "UpdateSubjectInput!" },
//     },
//     updateUserByPublicId: {
//       __type: "User!",
//       __args: { data: "UpdateUserRequestDto!", publicId: "String!" },
//     },
//     updateUserRolesFromArray: {
//       __type: "User!",
//       __args: { data: "UpdateUserRolesFromArrayRequestDto!" },
//     },
//     updateYearGroup: {
//       __type: "YearGroupEntity!",
//       __args: { data: "UpdateYearGroupInput!" },
//     },
//   },
//   query: {
//     __typename: { __type: "String!" },
//     getAllAssignment: {
//       __type: "[AssignmentEntity!]!",
//       __args: { data: "FindAllInput!" },
//     },
//     getAllAssignmentSubmission: {
//       __type: "[AssignmentSubmissionEntity!]!",
//       __args: { data: "FindAllInput!" },
//     },
//     getAllClass: {
//       __type: "[ClassEntity!]!",
//       __args: { data: "FindAllInput!" },
//     },
//     getAllEducatorProfile: {
//       __type: "[EducatorProfileDto!]!",
//       __args: { data: "FindAllInput!" },
//     },
//     getAllKeyStage: {
//       __type: "[KeyStageEntity!]!",
//       __args: { data: "FindAllInput!" },
//     },
//     getAllLesson: {
//       __type: "[LessonEntity!]!",
//       __args: { data: "FindAllInput!" },
//     },
//     getAllPermission: {
//       __type: "[Permission!]!",
//       __args: { data: "FindAllInput!" },
//     },
//     getAllPermissionGroup: {
//       __type: "[PermissionGroup!]!",
//       __args: { data: "FindAllInput!" },
//     },
//     getAllRole: { __type: "[Role!]!", __args: { data: "FindAllInput!" } },
//     getAllStudentProfile: {
//       __type: "[StudentProfileDto!]!",
//       __args: { data: "FindAllInput!" },
//     },
//     getAllSubject: {
//       __type: "[SubjectEntity!]!",
//       __args: { data: "FindAllInput!" },
//     },
//     getAllUsers: {
//       __type: "[User!]!",
//       __args: { data: "PaginatedGetAllRequestDto!" },
//     },
//     getAllYearGroup: {
//       __type: "[YearGroupEntity!]!",
//       __args: { data: "FindAllInput!" },
//     },
//     getAssignment: {
//       __type: "AssignmentEntity!",
//       __args: { data: "IdInput!" },
//     },
//     getAssignmentBy: {
//       __type: "AssignmentEntity!",
//       __args: { data: "FindOneByInput!" },
//     },
//     getAssignmentSubmission: {
//       __type: "AssignmentSubmissionEntity!",
//       __args: { data: "IdInput!" },
//     },
//     getAssignmentSubmissionBy: {
//       __type: "AssignmentSubmissionEntity!",
//       __args: { data: "FindOneByInput!" },
//     },
//     getClass: { __type: "ClassEntity!", __args: { data: "IdInput!" } },
//     getClassBy: { __type: "ClassEntity!", __args: { data: "FindOneByInput!" } },
//     getEducatorProfile: {
//       __type: "EducatorProfileDto!",
//       __args: { data: "IdInput!" },
//     },
//     getEducatorProfileBy: {
//       __type: "EducatorProfileDto!",
//       __args: { data: "FindOneByInput!" },
//     },
//     getKeyStage: { __type: "KeyStageEntity!", __args: { data: "IdInput!" } },
//     getKeyStageBy: {
//       __type: "KeyStageEntity!",
//       __args: { data: "FindOneByInput!" },
//     },
//     getLesson: { __type: "LessonEntity!", __args: { data: "IdInput!" } },
//     getLessonBy: {
//       __type: "LessonEntity!",
//       __args: { data: "FindOneByInput!" },
//     },
//     getPermission: { __type: "Permission!", __args: { data: "IdInput!" } },
//     getPermissionBy: {
//       __type: "Permission!",
//       __args: { data: "FindOneByInput!" },
//     },
//     getPermissionGroup: {
//       __type: "PermissionGroup!",
//       __args: { data: "IdInput!" },
//     },
//     getPermissionGroupBy: {
//       __type: "PermissionGroup!",
//       __args: { data: "FindOneByInput!" },
//     },
//     getPermissionGroupsForRole: {
//       __type: "[PermissionGroup!]!",
//       __args: { data: "IdRequestDto!" },
//     },
//     getPermissionsForGroup: {
//       __type: "[Permission!]!",
//       __args: { data: "IdRequestDto!" },
//     },
//     getRole: { __type: "Role!", __args: { data: "IdInput!" } },
//     getRoleBy: { __type: "Role!", __args: { data: "FindOneByInput!" } },
//     getRolesForUser: {
//       __type: "[Role!]!",
//       __args: { data: "PublicIdRequestDto!" },
//     },
//     getStudentProfile: {
//       __type: "StudentProfileDto!",
//       __args: { data: "IdInput!" },
//     },
//     getStudentProfileBy: {
//       __type: "StudentProfileDto!",
//       __args: { data: "FindOneByInput!" },
//     },
//     getSubject: { __type: "SubjectEntity!", __args: { data: "IdInput!" } },
//     getSubjectBy: {
//       __type: "SubjectEntity!",
//       __args: { data: "FindOneByInput!" },
//     },
//     getUserByPublicId: {
//       __type: "User!",
//       __args: { data: "PublicIdRequestDto!" },
//     },
//     getUsersRolesAndPermissions: {
//       __type: "RolesPermissionsResponse!",
//       __args: { data: "UserPermissionsInput!" },
//     },
//     getYearGroup: { __type: "YearGroupEntity!", __args: { data: "IdInput!" } },
//     getYearGroupBy: {
//       __type: "YearGroupEntity!",
//       __args: { data: "FindOneByInput!" },
//     },
//   },
//   subscription: {},
// } as const;

// export interface AssignmentEntity {
//   __typename?: "AssignmentEntity";
//   class: ClassEntity;
//   createdAt: ScalarsEnums["DateTime"];
//   description?: Maybe<ScalarsEnums["String"]>;
//   dueDate?: Maybe<ScalarsEnums["DateTime"]>;
//   id: ScalarsEnums["ID"];
//   lesson: LessonEntity;
//   title: ScalarsEnums["String"];
//   updatedAt: ScalarsEnums["DateTime"];
// }

// export interface AssignmentSubmissionEntity {
//   __typename?: "AssignmentSubmissionEntity";
//   assignment: AssignmentEntity;
//   createdAt: ScalarsEnums["DateTime"];
//   feedback?: Maybe<ScalarsEnums["String"]>;
//   grade?: Maybe<ScalarsEnums["String"]>;
//   id: ScalarsEnums["ID"];
//   student: StudentProfileDto;
//   submissionContent?: Maybe<ScalarsEnums["String"]>;
//   submittedAt?: Maybe<ScalarsEnums["DateTime"]>;
//   updatedAt: ScalarsEnums["DateTime"];
// }

// export interface AuthTokens {
//   __typename?: "AuthTokens";
//   accessToken: ScalarsEnums["String"];
//   refreshToken: ScalarsEnums["String"];
// }

// export interface ClassEntity {
//   __typename?: "ClassEntity";
//   createdAt: ScalarsEnums["DateTime"];
//   educators?: Maybe<Array<EducatorProfileDto>>;
//   id: ScalarsEnums["ID"];
//   name: ScalarsEnums["String"];
//   students?: Maybe<Array<StudentProfileDto>>;
//   subject?: Maybe<SubjectEntity>;
//   updatedAt: ScalarsEnums["DateTime"];
//   yearGroup?: Maybe<YearGroupEntity>;
// }

// export interface EducatorProfileDto {
//   __typename?: "EducatorProfileDto";
//   createdAt: ScalarsEnums["DateTime"];
//   id: ScalarsEnums["ID"];
//   staffId: ScalarsEnums["Float"];
//   updatedAt: ScalarsEnums["DateTime"];
// }

// export interface KeyStageEntity {
//   __typename?: "KeyStageEntity";
//   createdAt: ScalarsEnums["DateTime"];
//   description?: Maybe<ScalarsEnums["String"]>;
//   id: ScalarsEnums["ID"];
//   name?: Maybe<ScalarsEnums["String"]>;
//   stage: ScalarsEnums["ValidKeyStage"];
//   updatedAt: ScalarsEnums["DateTime"];
//   yearGroups: Array<YearGroupEntity>;
// }

// export interface LessonEntity {
//   __typename?: "LessonEntity";
//   content?: Maybe<ScalarsEnums["String"]>;
//   createdAt: ScalarsEnums["DateTime"];
//   createdBy?: Maybe<EducatorProfileDto>;
//   createdById?: Maybe<ScalarsEnums["ID"]>;
//   id: ScalarsEnums["ID"];
//   recommendedYearGroups?: Maybe<Array<YearGroupEntity>>;
//   subject?: Maybe<SubjectEntity>;
//   title: ScalarsEnums["String"];
//   updatedAt: ScalarsEnums["DateTime"];
// }

// export interface LoginResponse {
//   __typename?: "LoginResponse";
//   accessToken: ScalarsEnums["String"];
//   refreshToken: ScalarsEnums["String"];
//   userDetails: UserDetails;
// }

// export interface Permission {
//   __typename?: "Permission";
//   createdAt: ScalarsEnums["DateTime"];
//   description?: Maybe<ScalarsEnums["String"]>;
//   id: ScalarsEnums["ID"];
//   name: ScalarsEnums["String"];
//   permissionGroups?: Maybe<Array<PermissionGroup>>;
//   roles?: Maybe<Array<Role>>;
//   updatedAt: ScalarsEnums["DateTime"];
// }

// export interface PermissionDTO {
//   __typename?: "PermissionDTO";
//   createdAt: ScalarsEnums["DateTime"];
//   id: ScalarsEnums["Float"];
//   name: ScalarsEnums["String"];
//   updatedAt: ScalarsEnums["DateTime"];
// }

// export interface PermissionGroup {
//   __typename?: "PermissionGroup";
//   createdAt: ScalarsEnums["DateTime"];
//   description: ScalarsEnums["String"];
//   id: ScalarsEnums["ID"];
//   name: ScalarsEnums["String"];
//   permissions?: Maybe<Array<Permission>>;
//   roles?: Maybe<Array<Role>>;
//   updatedAt: ScalarsEnums["DateTime"];
// }

// export interface Role {
//   __typename?: "Role";
//   createdAt: ScalarsEnums["DateTime"];
//   description: ScalarsEnums["String"];
//   id: ScalarsEnums["ID"];
//   name: ScalarsEnums["String"];
//   permissionGroups?: Maybe<Array<PermissionGroup>>;
//   permissions?: Maybe<Array<Permission>>;
//   updatedAt: ScalarsEnums["DateTime"];
// }

// export interface RoleDTO {
//   __typename?: "RoleDTO";
//   createdAt: ScalarsEnums["DateTime"];
//   id: ScalarsEnums["Float"];
//   name: ScalarsEnums["String"];
//   updatedAt: ScalarsEnums["DateTime"];
// }

// export interface RolesPermissionsResponse {
//   __typename?: "RolesPermissionsResponse";
//   permissions: Array<PermissionDTO>;
//   roles: Array<RoleDTO>;
// }

// export interface StudentProfileDto {
//   __typename?: "StudentProfileDto";
//   createdAt: ScalarsEnums["DateTime"];
//   id: ScalarsEnums["ID"];
//   schoolYear: ScalarsEnums["Float"];
//   studentId: ScalarsEnums["Float"];
//   updatedAt: ScalarsEnums["DateTime"];
// }

// export interface SubjectEntity {
//   __typename?: "SubjectEntity";
//   createdAt: ScalarsEnums["DateTime"];
//   id: ScalarsEnums["ID"];
//   name: ScalarsEnums["String"];
//   updatedAt: ScalarsEnums["DateTime"];
//   yearGroups?: Maybe<Array<YearGroupEntity>>;
// }

// export interface User {
//   __typename?: "User";
//   addressLine1?: Maybe<ScalarsEnums["String"]>;
//   addressLine2?: Maybe<ScalarsEnums["String"]>;
//   city?: Maybe<ScalarsEnums["String"]>;
//   country?: Maybe<ScalarsEnums["String"]>;
//   county?: Maybe<ScalarsEnums["String"]>;
//   createdAt: ScalarsEnums["DateTime"];
//   dateOfBirth?: Maybe<ScalarsEnums["DateTime"]>;
//   educatorProfile?: Maybe<EducatorProfileDto>;
//   email: ScalarsEnums["String"];
//   firstName: ScalarsEnums["String"];
//   id: ScalarsEnums["ID"];
//   lastName: ScalarsEnums["String"];
//   phoneNumber?: Maybe<ScalarsEnums["String"]>;
//   postalCode?: Maybe<ScalarsEnums["String"]>;
//   publicId: ScalarsEnums["String"];
//   roles?: Maybe<Array<Role>>;
//   studentProfile?: Maybe<StudentProfileDto>;
//   updatedAt: ScalarsEnums["DateTime"];
//   userType: ScalarsEnums["String"];
// }

// export interface UserDetails {
//   __typename?: "UserDetails";
//   permissions: Array<ScalarsEnums["String"]>;
//   publicId: ScalarsEnums["String"];
// }

// export interface YearGroupEntity {
//   __typename?: "YearGroupEntity";
//   createdAt: ScalarsEnums["DateTime"];
//   id: ScalarsEnums["ID"];
//   keyStage?: Maybe<KeyStageEntity>;
//   subjects?: Maybe<Array<SubjectEntity>>;
//   updatedAt: ScalarsEnums["DateTime"];
//   year: ScalarsEnums["ValidYear"];
// }

// export interface Mutation {
//   __typename?: "Mutation";
//   /**
//    * Create one Assignment
//    */
//   createAssignment: (args: { data: CreateAssignmentInput }) => AssignmentEntity;
//   /**
//    * Create one AssignmentSubmission
//    */
//   createAssignmentSubmission: (args: {
//     data: CreateAssignmentSubmissionInput;
//   }) => AssignmentSubmissionEntity;
//   /**
//    * Create one Class
//    */
//   createClass: (args: { data: CreateClassInput }) => ClassEntity;
//   /**
//    * Create one EducatorProfile
//    */
//   createEducatorProfile: (args: {
//     data: CreateEducatorProfileInput;
//   }) => EducatorProfileDto;
//   /**
//    * Create one KeyStage
//    */
//   createKeyStage: (args: { data: CreateKeyStageInput }) => KeyStageEntity;
//   /**
//    * Create one Lesson
//    */
//   createLesson: (args: { data: CreateLessonInput }) => LessonEntity;
//   /**
//    * Create one Permission
//    */
//   createPermission: (args: { data: CreatePermissionInput }) => Permission;
//   /**
//    * Create one PermissionGroup
//    */
//   createPermissionGroup: (args: {
//     data: CreatePermissionGroupInput;
//   }) => PermissionGroup;
//   /**
//    * Create one Role
//    */
//   createRole: (args: { data: CreateRoleInput }) => Role;
//   /**
//    * Create one StudentProfile
//    */
//   createStudentProfile: (args: {
//     data: CreateStudentProfileInput;
//   }) => StudentProfileDto;
//   /**
//    * Create one Subject
//    */
//   createSubject: (args: { data: CreateSubjectInput }) => SubjectEntity;
//   createUser: (args: { data: CreateUserRequestDto }) => User;
//   createUserWithProfile: (args: { data: CreateUserWithProfileInput }) => User;
//   /**
//    * Create one YearGroup
//    */
//   createYearGroup: (args: { data: CreateYearGroupInput }) => YearGroupEntity;
//   /**
//    * Delete one Assignment
//    */
//   deleteAssignment: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
//   /**
//    * Delete one AssignmentSubmission
//    */
//   deleteAssignmentSubmission: (args: {
//     data: IdInput;
//   }) => ScalarsEnums["Boolean"];
//   /**
//    * Delete one Class
//    */
//   deleteClass: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
//   /**
//    * Delete one EducatorProfile
//    */
//   deleteEducatorProfile: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
//   /**
//    * Delete one KeyStage
//    */
//   deleteKeyStage: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
//   /**
//    * Delete one Lesson
//    */
//   deleteLesson: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
//   /**
//    * Delete one Permission
//    */
//   deletePermission: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
//   /**
//    * Delete one PermissionGroup
//    */
//   deletePermissionGroup: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
//   /**
//    * Delete one Role
//    */
//   deleteRole: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
//   /**
//    * Delete one StudentProfile
//    */
//   deleteStudentProfile: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
//   /**
//    * Delete one Subject
//    */
//   deleteSubject: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
//   /**
//    * Delete one YearGroup
//    */
//   deleteYearGroup: (args: { data: IdInput }) => ScalarsEnums["Boolean"];
//   logUserInWithEmailAndPassword: (args: { data: LoginRequest }) => AuthTokens;
//   refreshUsersTokens: (args: {
//     refreshToken: ScalarsEnums["String"];
//   }) => LoginResponse;
//   registerNewUserLocally: (args: { data: CreateUserRequestDto }) => User;
//   removeUserByPublicId: (args: { data: PublicIdRequestDto }) => User;
//   /**
//    * Updates one Assignment
//    */
//   updateAssignment: (args: { data: UpdateAssignmentInput }) => AssignmentEntity;
//   /**
//    * Updates one AssignmentSubmission
//    */
//   updateAssignmentSubmission: (args: {
//     data: UpdateAssignmentSubmissionInput;
//   }) => AssignmentSubmissionEntity;
//   /**
//    * Updates one Class
//    */
//   updateClass: (args: { data: UpdateClassInput }) => ClassEntity;
//   /**
//    * Updates one EducatorProfile
//    */
//   updateEducatorProfile: (args: {
//     data: UpdateEducatorProfileInput;
//   }) => EducatorProfileDto;
//   /**
//    * Updates one KeyStage
//    */
//   updateKeyStage: (args: { data: UpdateKeyStageInput }) => KeyStageEntity;
//   /**
//    * Updates one Lesson
//    */
//   updateLesson: (args: { data: UpdateLessonInput }) => LessonEntity;
//   /**
//    * Updates one Permission
//    */
//   updatePermission: (args: { data: UpdatePermissionInput }) => Permission;
//   /**
//    * Updates one PermissionGroup
//    */
//   updatePermissionGroup: (args: {
//     data: UpdatePermissionGroupInput;
//   }) => PermissionGroup;
//   updatePermissionGroupPermissionsFromArray: (args: {
//     data: SubmitIdArrayByIdRequestDto;
//   }) => PermissionGroup;
//   updatePermissionGroupsForRole: (args: {
//     data: SubmitIdArrayByIdRequestDto;
//   }) => Role;
//   /**
//    * Updates one Role
//    */
//   updateRole: (args: { data: UpdateRoleInput }) => Role;
//   /**
//    * Updates one StudentProfile
//    */
//   updateStudentProfile: (args: {
//     data: UpdateStudentProfileInput;
//   }) => StudentProfileDto;
//   /**
//    * Updates one Subject
//    */
//   updateSubject: (args: { data: UpdateSubjectInput }) => SubjectEntity;
//   updateUserByPublicId: (args: {
//     data: UpdateUserRequestDto;
//     publicId: ScalarsEnums["String"];
//   }) => User;
//   updateUserRolesFromArray: (args: {
//     data: UpdateUserRolesFromArrayRequestDto;
//   }) => User;
//   /**
//    * Updates one YearGroup
//    */
//   updateYearGroup: (args: { data: UpdateYearGroupInput }) => YearGroupEntity;
// }

// export interface Query {
//   __typename?: "Query";
//   /**
//    * Returns all Assignment (optionally filtered)
//    */
//   getAllAssignment: (args: { data: FindAllInput }) => Array<AssignmentEntity>;
//   /**
//    * Returns all AssignmentSubmission (optionally filtered)
//    */
//   getAllAssignmentSubmission: (args: {
//     data: FindAllInput;
//   }) => Array<AssignmentSubmissionEntity>;
//   /**
//    * Returns all Class (optionally filtered)
//    */
//   getAllClass: (args: { data: FindAllInput }) => Array<ClassEntity>;
//   /**
//    * Returns all EducatorProfile (optionally filtered)
//    */
//   getAllEducatorProfile: (args: {
//     data: FindAllInput;
//   }) => Array<EducatorProfileDto>;
//   /**
//    * Returns all KeyStage (optionally filtered)
//    */
//   getAllKeyStage: (args: { data: FindAllInput }) => Array<KeyStageEntity>;
//   /**
//    * Returns all Lesson (optionally filtered)
//    */
//   getAllLesson: (args: { data: FindAllInput }) => Array<LessonEntity>;
//   /**
//    * Returns all Permission (optionally filtered)
//    */
//   getAllPermission: (args: { data: FindAllInput }) => Array<Permission>;
//   /**
//    * Returns all PermissionGroup (optionally filtered)
//    */
//   getAllPermissionGroup: (args: {
//     data: FindAllInput;
//   }) => Array<PermissionGroup>;
//   /**
//    * Returns all Role (optionally filtered)
//    */
//   getAllRole: (args: { data: FindAllInput }) => Array<Role>;
//   /**
//    * Returns all StudentProfile (optionally filtered)
//    */
//   getAllStudentProfile: (args: {
//     data: FindAllInput;
//   }) => Array<StudentProfileDto>;
//   /**
//    * Returns all Subject (optionally filtered)
//    */
//   getAllSubject: (args: { data: FindAllInput }) => Array<SubjectEntity>;
//   getAllUsers: (args: { data: PaginatedGetAllRequestDto }) => Array<User>;
//   /**
//    * Returns all YearGroup (optionally filtered)
//    */
//   getAllYearGroup: (args: { data: FindAllInput }) => Array<YearGroupEntity>;
//   /**
//    * Returns one Assignment
//    */
//   getAssignment: (args: { data: IdInput }) => AssignmentEntity;
//   /**
//    * Returns one Assignment by given conditions
//    */
//   getAssignmentBy: (args: { data: FindOneByInput }) => AssignmentEntity;
//   /**
//    * Returns one AssignmentSubmission
//    */
//   getAssignmentSubmission: (args: {
//     data: IdInput;
//   }) => AssignmentSubmissionEntity;
//   /**
//    * Returns one AssignmentSubmission by given conditions
//    */
//   getAssignmentSubmissionBy: (args: {
//     data: FindOneByInput;
//   }) => AssignmentSubmissionEntity;
//   /**
//    * Returns one Class
//    */
//   getClass: (args: { data: IdInput }) => ClassEntity;
//   /**
//    * Returns one Class by given conditions
//    */
//   getClassBy: (args: { data: FindOneByInput }) => ClassEntity;
//   /**
//    * Returns one EducatorProfile
//    */
//   getEducatorProfile: (args: { data: IdInput }) => EducatorProfileDto;
//   /**
//    * Returns one EducatorProfile by given conditions
//    */
//   getEducatorProfileBy: (args: { data: FindOneByInput }) => EducatorProfileDto;
//   /**
//    * Returns one KeyStage
//    */
//   getKeyStage: (args: { data: IdInput }) => KeyStageEntity;
//   /**
//    * Returns one KeyStage by given conditions
//    */
//   getKeyStageBy: (args: { data: FindOneByInput }) => KeyStageEntity;
//   /**
//    * Returns one Lesson
//    */
//   getLesson: (args: { data: IdInput }) => LessonEntity;
//   /**
//    * Returns one Lesson by given conditions
//    */
//   getLessonBy: (args: { data: FindOneByInput }) => LessonEntity;
//   /**
//    * Returns one Permission
//    */
//   getPermission: (args: { data: IdInput }) => Permission;
//   /**
//    * Returns one Permission by given conditions
//    */
//   getPermissionBy: (args: { data: FindOneByInput }) => Permission;
//   /**
//    * Returns one PermissionGroup
//    */
//   getPermissionGroup: (args: { data: IdInput }) => PermissionGroup;
//   /**
//    * Returns one PermissionGroup by given conditions
//    */
//   getPermissionGroupBy: (args: { data: FindOneByInput }) => PermissionGroup;
//   getPermissionGroupsForRole: (args: {
//     data: IdRequestDto;
//   }) => Array<PermissionGroup>;
//   getPermissionsForGroup: (args: { data: IdRequestDto }) => Array<Permission>;
//   /**
//    * Returns one Role
//    */
//   getRole: (args: { data: IdInput }) => Role;
//   /**
//    * Returns one Role by given conditions
//    */
//   getRoleBy: (args: { data: FindOneByInput }) => Role;
//   getRolesForUser: (args: { data: PublicIdRequestDto }) => Array<Role>;
//   /**
//    * Returns one StudentProfile
//    */
//   getStudentProfile: (args: { data: IdInput }) => StudentProfileDto;
//   /**
//    * Returns one StudentProfile by given conditions
//    */
//   getStudentProfileBy: (args: { data: FindOneByInput }) => StudentProfileDto;
//   /**
//    * Returns one Subject
//    */
//   getSubject: (args: { data: IdInput }) => SubjectEntity;
//   /**
//    * Returns one Subject by given conditions
//    */
//   getSubjectBy: (args: { data: FindOneByInput }) => SubjectEntity;
//   getUserByPublicId: (args: { data: PublicIdRequestDto }) => User;
//   getUsersRolesAndPermissions: (args: {
//     data: UserPermissionsInput;
//   }) => RolesPermissionsResponse;
//   /**
//    * Returns one YearGroup
//    */
//   getYearGroup: (args: { data: IdInput }) => YearGroupEntity;
//   /**
//    * Returns one YearGroup by given conditions
//    */
//   getYearGroupBy: (args: { data: FindOneByInput }) => YearGroupEntity;
// }

// export interface Subscription {
//   __typename?: "Subscription";
// }

// export interface GeneratedSchema {
//   query: Query;
//   mutation: Mutation;
//   subscription: Subscription;
// }

// export type ScalarsEnums = {
//   [Key in keyof Scalars]: Scalars[Key] extends { output: unknown }
//     ? Scalars[Key]["output"]
//     : never;
// } & {
//   ValidKeyStage: ValidKeyStage;
//   ValidYear: ValidYear;
// };
