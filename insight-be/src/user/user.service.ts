// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/base.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo);
  }

  /**
   * Find a user by their email address.
   * Throws a NotFoundException if no matching user is found.
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found.`);
    }
    return user;
  }
}
