import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Min, Max } from 'class-validator';

/* ---------- re-usable GraphQL types ---------- */

@ObjectType()
export class PageInfo {
  @Field(() => Int) readonly page!: number;
  @Field(() => Int) readonly take!: number;
  @Field(() => Int) readonly itemCount!: number;
  @Field(() => Int) readonly pageCount!: number;
  @Field() readonly hasPreviousPage!: boolean;
  @Field() readonly hasNextPage!: boolean;
}

@ObjectType({ isAbstract: true })
export abstract class Page<TItem> {
  @Field(() => [Object])
  data!: TItem[];

  @Field(() => PageInfo)
  meta!: PageInfo;
}

/* ---------- GraphQL input for requests ---------- */

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @Min(1)
  page = 1;

  @Field(() => Int, { defaultValue: 25 })
  @Min(1)
  @Max(100)
  take = 25;
}

/* ---------- single helper function ---------- */

export async function paginate<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  { page = 1, take = 25 }: Partial<PaginationInput>,
): Promise<{ data: T[]; meta: PageInfo }> {
  const [data, itemCount] = await qb
    .skip((page - 1) * take)
    .take(take)
    .getManyAndCount();

  const pageCount = Math.ceil(itemCount / take);

  return {
    data,
    meta: {
      page,
      take,
      itemCount,
      pageCount,
      hasPreviousPage: page > 1,
      hasNextPage: page < pageCount,
    },
  };
}
