// base.service.ts
import { NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { AbstractBaseEntity } from './base.entity';

export abstract class BaseService<
  T extends AbstractBaseEntity,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T> & { id: number },
> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(createDto: CreateDto): Promise<T> {
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
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async findOneBy(conditions: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.repository.findOne({ where: conditions });
    if (!entity) {
      throw new NotFoundException(`Entity not found by given conditions.`);
    }
    return entity;
  }

  async update(updateDto: UpdateDto): Promise<T> {
    const entity = await this.repository.preload(updateDto);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${updateDto.id} not found`);
    }
    return this.repository.save(entity);
  }

  async remove(id: T['id']): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.delete(entity.id);
  }
}
