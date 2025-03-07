// user.model.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType() // For GraphQL Schema
@Entity('users') // For TypeORM DB Table (optional explicit table name)
export class User {
  @Field(() => ID) // GraphQL ID field
  @PrimaryGeneratedColumn() // TypeORM primary key
  id: number;

  @Field() // GraphQL schema field
  @Column() // DB Column
  name: string;

  @Field({ nullable: true }) // Optional field in GraphQL
  @Column({ nullable: true }) // DB Column
  email?: string;
}
