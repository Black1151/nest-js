/* -------------------------------------------------------------------------- */
/* BaseService ‒ generic CRUD + relation-hydration                            */
/* -------------------------------------------------------------------------- */
import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { RelationIdsInput } from './base.inputs';

/* -------------------------------------------------------------------------- */
/* Helper types                                                               */
/* -------------------------------------------------------------------------- */
type AugmentedDto<T> = DeepPartial<T> & {
  /** Generic typed-array field we added to create / update DTOs */
  relationIds?: RelationIdsInput[];

  /** Dynamic “fooIds” / “fooId” props created at runtime */
  [key: string]: any;
};

interface FindAllOpts {
  limit?: number;
  offset?: number;
  all?: boolean;
  relations?: string[];
  filters?: { column: string; value: any }[];
}

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */
@Injectable()
export class BaseService<
  T extends { id: number },
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T> & { id: number },
> {
  constructor(protected readonly repo: Repository<T>) {}

  /* ───────────────────────── private helpers ──────────────────────────── */

  /** 0️⃣  Expand the generic relationIds[] array into fooIds properties */
  private expandGenericRelationArray(raw: AugmentedDto<T>): void {
    if (!Array.isArray(raw.relationIds)) return;

    const obj = raw as Record<string, any>; // ← cast once

    for (const { relation, ids } of raw.relationIds) {
      obj[`${relation}Ids`] = ids; // ← write via the casted ref
    }
    delete obj.relationIds;
  }

  /**
   * 1️⃣  Convert any “fooId(s)” fields to actual entities, validate they exist,
   *     and return a DeepPartial<T> ready for repo.create / repo.merge.
   */
  private async hydrateRelations<K extends AugmentedDto<T>>(
    raw: K,
  ): Promise<DeepPartial<T>> {
    if (!raw) return raw;

    /* STEP 0 – fan-out generic array once */
    this.expandGenericRelationArray(raw);

    const meta = this.repo.metadata;
    const dto = { ...raw }; // shallow copy
    const result: any = { ...dto };

    for (const rel of meta.relations) {
      const prop = rel.propertyName; // e.g. “yearGroups”
      const singleKey = `${prop}Id`;
      const manyKey = `${prop}Ids`;

      let ids: number | number[] | undefined =
        dto[manyKey] ?? dto[singleKey] ?? dto[prop];

      if (ids === undefined) continue; // caller didn’t send this rel

      const idsArr = Array.isArray(ids) ? ids.map(Number) : [Number(ids)];

      // strip raw fields so they don’t pollute the entity
      delete result[manyKey];
      delete result[singleKey];
      delete result[prop];

      const relRepo = this.repo.manager.getRepository(rel.type as any);
      const found = await relRepo.find({ where: { id: In(idsArr) } as any });

      if (found.length !== idsArr.length) {
        const missing = idsArr.filter((id) => !found.some((f) => f.id === id));
        throw new BadRequestException(
          `Invalid ${prop} ID${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`,
        );
      }

      result[prop] = Array.isArray(ids) ? found : found[0];
    }

    return result as DeepPartial<T>;
  }

  /* ───────────────────────── public CRUD API ──────────────────────────── */

  async findAll(opts: FindAllOpts): Promise<T[]> {
    const { limit, offset, all, relations, filters } = opts;

    const options: FindManyOptions<T> = { relations };

    if (!all) {
      options.take = limit ?? 50;
      options.skip = offset ?? 0;
    }

    if (filters?.length) {
      const where: FindOptionsWhere<T> = filters.reduce(
        (acc, f) => ({ ...acc, [f.column as keyof T]: f.value }) as any,
        {} as FindOptionsWhere<T>,
      );
      options.where = where;
    }

    return this.repo.find(options);
  }

  async findOne(id: number, relations?: string[]): Promise<T> {
    return this.repo.findOneOrFail({ where: { id } as any, relations });
  }

  async findOneBy(
    where: FindOptionsWhere<T>,
    relations?: string[],
  ): Promise<T> {
    return this.repo.findOneOrFail({ where, relations });
  }

  /** CREATE – relation-aware & validated */
  async create(dto: CreateDto): Promise<T> {
    const data = await this.hydrateRelations(dto as AugmentedDto<T>);
    const entity = this.repo.create(data);
    return this.repo.save(entity); // only reached if validation passes
  }

  /** UPDATE – relation-aware & validated */
  async update(dto: UpdateDto): Promise<T> {
    const { id, ...rest } = dto as any;
    let entity = await this.repo.findOneOrFail({ where: { id } as any });

    const data = await this.hydrateRelations(rest as AugmentedDto<T>);
    entity = this.repo.merge(entity, data);

    return this.repo.save(entity);
  }

  async remove(id: number): Promise<number> {
    await this.repo.delete(id);
    return id;
  }
}
