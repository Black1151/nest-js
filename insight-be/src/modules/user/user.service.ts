// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseService } from '../../common/base.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/modules/rbac/sub/role/role.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
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

  async hashPassword(plainPass: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainPass, saltRounds);
  }

  override async create(createDto: CreateUserDto): Promise<User> {
    if (createDto.password) {
      createDto.password = await this.hashPassword(createDto.password);
    }
    return super.create(createDto);
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

  async updateByPublicId(
    publicId: string,
    updateDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOneBy({ publicId });

    Object.assign(user, updateDto);

    return this.userRepository.save(user);
  }

  /**
   * DELETE by publicId
   */
  async removeByPublicId(publicId: string): Promise<void> {
    const user = await this.findOneBy({ publicId });
    // We remove by numeric id under the hood
    await this.userRepository.delete(user.id);
  }

  /**
   * ADD ROLES
   */
  async addRoles(publicId: string, roleIds: number[]): Promise<User> {
    const user = await this.findOneBy({ publicId });
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
    const user = await this.findOneBy({ publicId });
    user.roles = user.roles?.filter((role) => !roleIds.includes(role.id));
    return this.userRepository.save(user);
  }

  async getUserWithRolesAndPermissions(publicId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { publicId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
