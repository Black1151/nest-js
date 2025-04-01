// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/modules/rbac/sub/role/role.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async hashPassword(plainPass: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainPass, saltRounds);
  }

  async create(createDto: CreateUserDto): Promise<User> {
    if (createDto.password) {
      createDto.password = await this.hashPassword(createDto.password);
    }
    const user = this.userRepository.create(createDto);
    return this.userRepository.save(user);
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

  async findOneByPublicId(publicId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { publicId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateByPublicId(
    publicId: string,
    updateDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOneByPublicId(publicId);

    Object.assign(user, updateDto);

    return this.userRepository.save(user);
  }

  /**
   * DELETE by publicId
   */
  async removeByPublicId(publicId: string): Promise<void> {
    const user = await this.findOneByPublicId(publicId);
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

  /**
   * Load user with roles, role-based permissions, and group-based permissions.
   * Then flatten all permissions into `user.combinedPermissions`.
   */
  async getUserWithRolesAndPermissions(publicId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { publicId },
      relations: [
        'roles',
        'roles.permissions',
        'roles.permissionGroups',
        'roles.permissionGroups.permissions',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const permSet = new Set<string>();

    user.roles?.forEach((role) => {
      role.permissions?.forEach((perm) => permSet.add(perm.name));
      role.permissionGroups?.forEach((group) => {
        group.permissions?.forEach((perm) => permSet.add(perm.name));
      });
    });
    user['combinedPermissions'] = Array.from(permSet);
    return user;
  }
}
