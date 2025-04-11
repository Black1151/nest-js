import { Catch, ArgumentsHost, Injectable } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { QueryFailedError } from 'typeorm';
import { UserInputError, ApolloError } from 'apollo-server-express';
import {
  DbErrorOverrideFriendly,
  PG_ERROR_NAME_MAP,
} from 'src/decorators/error-message-override.decorator';

@Injectable()
@Catch(QueryFailedError)
export class UiErrorMessagesFilter implements GqlExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();

    const driverError = exception.driverError as {
      code?: string;
      message?: string;
    };
    const errorCode = driverError?.code || '';
    const dbMessage = driverError?.message || '';

    const fieldName = info.fieldName;
    const parentTypeName = info.parentType.name;

    const schemaType: any = info.schema.getType(parentTypeName);
    const field = schemaType?.getFields?.()[fieldName];

    const typeExtensions = schemaType?.extensions;
    const fieldExtensions = field?.extensions;

    const typeOverrides: DbErrorOverrideFriendly[] =
      typeExtensions?.dbErrorOverrides || [];
    const fieldOverrides: DbErrorOverrideFriendly[] =
      fieldExtensions?.dbErrorOverrides || [];

    const allOverrides = [...typeOverrides, ...fieldOverrides];

    const match = allOverrides.find((ov) => {
      const numeric = PG_ERROR_NAME_MAP[ov.codeName];
      return numeric === errorCode;
    });

    if (match) {
      return new UserInputError(match.message, {
        detail: dbMessage,
      });
    }

    return new ApolloError(
      'An unknown database error occurred. Please contact support.',
      undefined,
      { detail: dbMessage },
    );
  }
}
