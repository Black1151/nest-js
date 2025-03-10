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
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  // user.service.ts

  async findByProviderId(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    let whereCondition: Partial<User>;
    switch (provider) {
      case 'google':
        whereCondition = { googleId: providerId };
        break;
      case 'apple':
        whereCondition = { appleId: providerId };
        break;
      case 'microsoft':
        whereCondition = { microsoftId: providerId };
        break;
      default:
        return null;
    }

    // findOne returns undefined if none found, but we can just return it
    return this.repository.findOne({ where: whereCondition });
  }

  async linkProviderId(
    user: User,
    provider: string,
    providerId: string,
  ): Promise<User> {
    switch (provider) {
      case 'google':
        user.googleId = providerId;
        break;
      case 'apple':
        user.appleId = providerId;
        break;
      case 'microsoft':
        user.microsoftId = providerId;
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
    return this.repository.save(user);
  }
}
