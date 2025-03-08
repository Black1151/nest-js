// base.service.ts
import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

/**
 * @param T        The entity type (must have an 'id' property of type number)
 * @param CreateDto A shape that extends DeepPartial<T> for creation
 * @param UpdateDto A shape that extends DeepPartial<T> for updates but must have at least { id: number }
 */
export abstract class BaseService<
  T extends { id: number },           // entity with at least an 'id'
  CreateDto extends DeepPartial<T>,    // create shape is partial T
  UpdateDto extends DeepPartial<T> & { id: number } // update shape must include 'id'
> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(createDto: CreateDto): Promise<T> {
    // create() expects DeepPartial<T>, so `createDto` is already the correct type
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(limit?: number, offset?: number): Promise<T[]> {
    return this.repository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: T['id']): Promise<T> {
    // Use FindOptionsWhere<T> to avoid casting
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async update(updateDto: UpdateDto): Promise<T> {
    const { id } = updateDto;

    // preload() expects DeepPartial<T>, which matches UpdateDto
    const entity = await this.repository.preload(updateDto);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return this.repository.save(entity);
  }

  async remove(id: T['id']): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.delete(entity.id);
  }
}
