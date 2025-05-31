import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.model';
import { AuthModule } from './modules/auth-modules/auth/auth.module';
import { LocalAuthModule } from './modules/auth-modules/local-auth/local-auth.module';
import { OktaAuthModule } from './modules/auth-modules/okta-auth/okta-auth.module';
import { GoogleAuthModule } from './modules/auth-modules/google-auth/google-auth.module';
import { MicrosoftAuthModule } from './modules/auth-modules/microsoft-auth/microsoft-auth.module';
import { ConfigModule } from '@nestjs/config';
import { RbacModule } from './modules/rbac/rbac.module';
import { Permission } from './modules/rbac/sub/permission/permission.entity';
import { APP_FILTER, APP_GUARD, DiscoveryModule } from '@nestjs/core';
import { GqlJwtAuthGuard } from './guards/auth.guard';
import { ApiPermissionsGuard } from './modules/rbac/guards/api-permissions.guard';
import { ApiPermissionMapping } from './modules/rbac/sub/api-permissions-mapping/api-permission-mapping.entity';
import { PermissionGroup } from './modules/rbac/sub/permission-group/permission-group.entity';
// import { UiErrorMessagesFilter } from './filters/ui-error-messages-filter';
import { Role } from './modules/rbac/sub/role/role.entity';
import { StudentProfileModule } from './modules/timbuktu/user-profiles/student-profile/student-profile.module';
import { EducatorProfileModule } from './modules/timbuktu/user-profiles/educator-profile/educator-profile.module';
import { StudentProfileEntity } from './modules/timbuktu/user-profiles/student-profile/student-profile.entity';
import { EducatorProfileEntity } from './modules/timbuktu/user-profiles/educator-profile/educator-profile.entity';
import { ClassModule } from './modules/timbuktu/administrative/class/class.module';
import { KeyStageModule } from './modules/timbuktu/administrative/key-stage/key-stage.module';
import { LessonModule } from './modules/timbuktu/administrative/lesson/lesson.module';
import { MultipleChoiceQuestionModule } from './modules/timbuktu/administrative/multiple-choice-question/multiple-choice-question.module';
import { QuizModule } from './modules/timbuktu/administrative/quiz/quiz.module';
import { SubjectModule } from './modules/timbuktu/administrative/subject/subject.module';
import { YearGroupModule } from './modules/timbuktu/administrative/year-group/year-group.module';
import { TopicModule } from './modules/timbuktu/administrative/topic/topic.module';
import { AssignmentSubmissionModule } from './modules/timbuktu/administrative/assignment-submission/assignment-submission.model';
import { AssignmentModule } from './modules/timbuktu/administrative/assignment/assignment.module';
import { AssignmentSubmissionEntity } from './modules/timbuktu/administrative/assignment-submission/assignment-submission.entity';
import { AssignmentEntity } from './modules/timbuktu/administrative/assignment/assignment.entity';
import { ClassEntity } from './modules/timbuktu/administrative/class/class.entity';
import { KeyStageEntity } from './modules/timbuktu/administrative/key-stage/key-stage.entity';
import { LessonEntity } from './modules/timbuktu/administrative/lesson/lesson.entity';
import { MultipleChoiceQuestionEntity } from './modules/timbuktu/administrative/multiple-choice-question/multiple-choice-question.entity';
import { QuizEntity } from './modules/timbuktu/administrative/quiz/quiz.entity';
import { SubjectEntity } from './modules/timbuktu/administrative/subject/subject.entity';
import { YearGroupEntity } from './modules/timbuktu/administrative/year-group/year-group.entity';
import { TopicEntity } from './modules/timbuktu/administrative/topic/topic.entity';
import { ClassLessonEntity } from './modules/timbuktu/administrative/pivot-tables/class-lesson/class-lesson.entity';
import { StyleCollectionModule } from './modules/timbuktu/administrative/style-collection/style-collection.module';
import { StyleCollectionEntity } from './modules/timbuktu/administrative/style-collection/style-collection.entity';
import { ElementStyleEntity } from './modules/timbuktu/administrative/element-style/element-style.entity';

@Module({
  imports: [
    DiscoveryModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      csrfPrevention: false,
      playground: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Role,
        Permission,
        ApiPermissionMapping,
        PermissionGroup,
        StudentProfileEntity,
        EducatorProfileEntity,
        AssignmentSubmissionEntity,
        AssignmentEntity,
        ClassEntity,
        KeyStageEntity,
        YearGroupEntity,
        SubjectEntity,
        LessonEntity,
        QuizEntity,
        MultipleChoiceQuestionEntity,
        TopicEntity,
        StyleCollectionEntity,
        ElementStyleEntity,
        AssignmentSubmissionEntity,
        AssignmentEntity,
        ClassLessonEntity,
      ],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    RbacModule,
    AuthModule,
    LocalAuthModule,
    OktaAuthModule,
    GoogleAuthModule,
    MicrosoftAuthModule,
    StudentProfileModule,
    EducatorProfileModule,
    KeyStageModule,
    YearGroupModule,
    SubjectModule,
    TopicModule,
    ClassModule,
    LessonModule,
    QuizModule,
    MultipleChoiceQuestionModule,
    StyleCollectionModule,
    AssignmentModule,
    AssignmentSubmissionModule,
    // AuditModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ApiPermissionsGuard,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: UiErrorMessagesFilter,
    // },
  ],
})
export class AppModule {}
