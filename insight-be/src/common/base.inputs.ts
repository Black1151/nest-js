import { InputType, Field, Int } from '@nestjs/graphql';

import {
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  IsString,
  MinLength,
} from 'class-validator';

/* ------------------------------------------------------------------ */
/* Helper: column/value filters                                       */
/* ------------------------------------------------------------------ */
@InputType()
export class FilterInput {
  @Field({ description: 'Column (property) name to filter on' })
  column!: string;

  @Field({ description: 'Exact value the column must equal' })
  value!: string;
}

/* ------------------------------------------------------------------ */
/* Pagination + relations + filters                                   */
/* ------------------------------------------------------------------ */
@InputType()
export class FindAllInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Maximum number of records to return',
  })
  limit?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'Number of records to skip',
  })
  offset?: number;

  @Field(() => Boolean, {
    nullable: true,
    description:
      'Set to true to return all records, ignoring pagination values',
  })
  all?: boolean;

  @Field(() => [String], {
    nullable: true,
    description:
      'Names of relations to eager-load (e.g. ["keyStage", "author"])',
  })
  relations?: string[];

  @Field(() => [FilterInput], {
    nullable: true,
    description:
      'Column/value pairs to filter by (records must satisfy **all** filters)',
  })
  filters?: FilterInput[];
}

/* ------------------------------------------------------------------ */
/* Exact-id look-ups                                                  */
/* ------------------------------------------------------------------ */
@InputType()
export class IdInput {
  @Field(() => Int)
  id!: number;

  @Field(() => [String], {
    nullable: true,
    description: 'Relations to eager-load with this single record',
  })
  relations?: string[];
}

/* ------------------------------------------------------------------ */
/* Arbitrary column look-ups                                          */
/* ------------------------------------------------------------------ */
@InputType()
export class FindOneByInput {
  @Field()
  column!: string;

  @Field()
  value!: string;

  @Field(() => [String], {
    nullable: true,
    description: 'Relations to eager-load with this single record',
  })
  relations?: string[];
}

/** One relation + its IDs */
@InputType()
export class RelationIdsInput {
  @Field({
    description: 'Relation name, exactly as on the entity (e.g. "yearGroups")',
  })
  @IsString()
  @MinLength(1)
  relation!: string;

  @Field(() => [Int], { description: 'IDs to link' })
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  ids!: number[];
}

/**
 * Mixin: put this on any create / update DTO to accept *many* relations.
 * Simply add `relationIds?: RelationIdsInput[]` to the GraphQL schema.
 */
@InputType()
export class HasRelationsInput {
  @Field(() => [RelationIdsInput], {
    nullable: true,
    description: 'Generic hook for attaching any relations by IDs',
  })
  relationIds?: RelationIdsInput[];
}
