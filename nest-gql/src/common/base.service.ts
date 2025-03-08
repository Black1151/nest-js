// // src/common/base/base.service.ts
// import { InjectRepository } from '@nestjs/typeorm';
// import { BaseEntity, ObjectLiteral, Repository } from 'typeorm';

// export abstract class BaseService<TEntity extends BaseEntity, TCreateDto, TUpdateDto> {
//   protected constructor(@InjectRepository()

//   protected readonly repository: Repository<TEntity>) {}

//   async create(createDto: TCreateDto): Promise<TEntity> {
//     const entity = this.repository.create(createDto as unknown as TEntity);
//     return this.repository.save(entity);
//   }

//   async findAll(): Promise<TEntity[]> {
//     return this.repository.find();
//   }
//   async findOne(id: number): Promise<TEntity | null> {
//     return this.repository.findOneBy({ id } as any);
//   }

//   async update(id: number, updateDto: TUpdateDto): Promise<TEntity> {
//     await this.repository.update({ id } as any, updateDto as any);
//     const updated = await this.repository.findOne(id);
//     if (!updated) {
//       throw new Error(`Entity with ID ${id} not found`);
//     }
//     return updated;
//   }

//   async remove(id: number): Promise<boolean> {
//     const result = await this.repository.delete(id);
//     return result.affected === 1;
//   }
// }
