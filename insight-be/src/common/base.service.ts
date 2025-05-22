/* -------------------------------------------------------------------------- */
/* BaseService – generic CRUD with simple relation handling                   */
/* -------------------------------------------------------------------------- */
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  In,
  Repository,
  ILike,
} from 'typeorm';

import { RelationIdsInput } from './base.inputs';

/* --------------------------------------------------------- helper types --- */
// interface RelationIdsInput {
//   relation: string;
//   ids: number[];
// }

interface FindAllOpts {
  limit?: number;
  offset?: number;
  all?: boolean;
  relations?: string[];
  filters?: { column: string; value: any }[];
}

/* ------------------------------------------------------------- service ---- */
@Injectable()
export class BaseService<
  T extends { id: number },
  CreateDto extends DeepPartial<T> & { relationIds?: RelationIdsInput[] },
  UpdateDto extends DeepPartial<T> & {
    id: number;
    relationIds?: RelationIdsInput[];
  },
> {
  constructor(
    protected readonly repo: Repository<T>,
    protected readonly dataSource: DataSource,
  ) {}

  /* ----------------------- helpers ----------------------- */

  /** validate IDs → load entities → attach to the root  */
  private async attachRelations(
    entity: T,
    relationIds: RelationIdsInput[],
    manager: EntityManager,
  ): Promise<void> {
    if (!relationIds?.length) return;

    for (const { relation, ids } of relationIds) {
      if (!ids?.length) continue;

      const relMeta = this.repo.metadata.relations.find(
        (r) => r.propertyName === relation,
      );
      if (!relMeta) {
        throw new BadRequestException(`Unknown relation “${relation}”.`);
      }

      const relRepo = manager.getRepository(relMeta.type as any);
      const related = await relRepo.find({ where: { id: In(ids) } as any });

      if (related.length !== ids.length) {
        const missing = ids.filter((id) => !related.some((r) => r.id === id));
        throw new BadRequestException(
          `Invalid ${relation} id${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`,
        );
      }

      (entity as any)[relation] = relMeta.isManyToMany ? related : related[0];
    }
  }

  /* ----------------------- public CRUD API ----------------------- */

  async findAll(opts: FindAllOpts): Promise<T[]> {
    const { limit, offset, all, relations, filters } = opts ?? {};
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

  /* CREATE --------------------------------------------------------------- */
  // async create(dto: CreateDto): Promise<T> {
  //   const { relationIds = [], ...scalar } = dto as any;

  //   console.log('BBB', dto);

  //   return this.dataSource.transaction(async (manager) => {
  //     let entity = manager.create(this.repo.target, scalar) as T;
  //     entity = await manager.save(entity);

  //     await this.attachRelations(entity, relationIds, manager);
  //     await manager.save(entity);

  //     return manager.getRepository(this.repo.target).findOneOrFail({
  //       where: { id: entity.id } as any,
  //       relations: relationIds.map((r) => r.relation),
  //     });
  //   });
  // }

  /* --------------------------------------------------------------------------
   BaseService – fixed create()
   -------------------------------------------------------------------------- */
  async create(dto: CreateDto): Promise<T> {
    const { relationIds = [], ...scalar } = dto as any;

    return this.dataSource.transaction(async (manager) => {
      const entity = manager.create(this.repo.target, scalar) as T;

      await this.attachRelations(entity, relationIds, manager);
      await manager.save(entity);

      return manager.getRepository(this.repo.target).findOneOrFail({
        where: { id: entity.id } as any,
        relations: relationIds.map((r) => r.relation),
      });
    });
  }

  async update(dto: UpdateDto): Promise<T> {
    const { id, relationIds = [], ...scalar } = dto as any;

    return this.dataSource.transaction(async (manager) => {
      let entity = (await manager.findOneOrFail(
        this.repo.target as EntityTarget<T>,
        { where: { id } as any },
      )) as T;

      entity = manager.merge(
        this.repo.target as EntityTarget<T>,
        entity,
        scalar,
      ) as T;

      await this.attachRelations(entity, relationIds, manager);
      await manager.save(entity);

      return manager.getRepository(this.repo.target).findOneOrFail({
        where: { id } as any,
        relations: relationIds.map((r) => r.relation),
      });
    });
  }

  async remove(id: number): Promise<number> {
    await this.repo.delete(id);
    return id;
  }

  /* ----------------------- search by columns ----------------------- */

  async searchByColumns(
    search: string,
    columns: (keyof T)[],
    opts?: { limit?: number; relations?: string[] },
  ): Promise<T[]> {
    const { limit = 10, relations } = opts ?? {};
    const where = columns.map((c) => ({ [c as string]: ILike(`%${search}%`) })) as any[];
    return this.repo.find({ where, take: limit, relations });
  }
}
