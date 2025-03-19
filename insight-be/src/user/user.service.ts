// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseService } from '../common/base.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/modules/rbac/role/role.entity';

@Injectable()

// still extend the base service and add
export class UsersService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    super(userRepository);
  }

  /**
   * CREATE
   * Create a new user with a new publicId (auto-generated in entity).
   * If you want to do extra business logic (e.g. set default roles),
   * you can do it here.
   */
  async createUser(createDto: CreateUserDto): Promise<User> {
    // Use the repository to create & save the user
    const user = this.userRepository.create(createDto);
    return this.userRepository.save(user);
  }

  /**
   * READ (ALL)
   * Optionally load roles (or other relations).
   * Limit & offset for pagination.
   */
  async findAllUsers(limit?: number, offset?: number): Promise<User[]> {
    return this.userRepository.find({
      relations: ['roles'],
      take: limit,
      skip: offset,
    });
  }

  /**
   * READ (ONE) by publicId
   */
  async findOneByPublicId(publicId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { publicId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException(
        `User with publicId '${publicId}' not found.`,
      );
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found.`);
    }
    return user;
  }

  /**
   * UPDATE by publicId
   * Merges the fields from DTO into the existing user,
   * then saves. (We do NOT trust the numeric ID from the client.)
   */
  async updateByPublicId(
    publicId: string,
    updateDto: UpdateUserDto,
  ): Promise<User> {
    // Find the existing user by publicId
    const user = await this.findOneByPublicId(publicId);

    // Merge in the incoming fields
    Object.assign(user, updateDto);

    // Make sure we don't overwrite the user.publicId or user.id accidentally
    // e.g., user.id = user.id; user.publicId = user.publicId;

    return this.userRepository.save(user);
  }

  /**
   * DELETE by publicId
   */
  async removeByPublicId(publicId: string): Promise<void> {
    const user = await this.findOneByPublicId(publicId);
    // We remove by numeric id under the hood
    await this.userRepository.delete(user.id);
  }

  /**
   * ADD ROLES
   */
  async addRoles(publicId: string, roleIds: number[]): Promise<User> {
    const user = await this.findOneByPublicId(publicId);
    const roles = await this.roleRepository.find({
      where: { id: In(roleIds) },
    });
    user.roles = [...(user.roles || []), ...roles];
    return this.userRepository.save(user);
  }

  /**
   * REMOVE ROLES
   */
  async removeRoles(publicId: string, roleIds: number[]): Promise<User> {
    const user = await this.findOneByPublicId(publicId);
    user.roles = user.roles?.filter((role) => !roleIds.includes(role.id));
    return this.userRepository.save(user);
  }

  async getUserWithRolesAndPermissions(publicId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { publicId },
      relations: ["roles", "roles.permissions"], // nest the permissions relation
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
