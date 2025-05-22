// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource, Raw } from 'typeorm';
import { User } from './user.model';

import { Role } from 'src/modules/rbac/sub/role/role.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserRequestDto, UpdateUserRequestDto } from './dto/req/req.dto';
import { CreateUserWithProfileInput } from './input/create-user-with-profile.input';
import { StudentProfileEntity } from '../timbuktu/user-profiles/student-profile/student-profile.entity';
import { EducatorProfileEntity } from '../timbuktu/user-profiles/educator-profile/educator-profile.entity';
import { UpdateUserWithProfileInput } from './input/update-user-with-profile-input';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(StudentProfileEntity)
    private readonly studentProfileRepository: Repository<StudentProfileEntity>,

    @InjectRepository(EducatorProfileEntity)
    private readonly educatorProfileRepository: Repository<EducatorProfileEntity>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(limit?: number, offset?: number): Promise<User[]> {
    return this.userRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async search(
    search: string,
    columns: (keyof User)[],
    limit = 10,
    filters?: { column: string; value: any }[],
  ): Promise<User[]> {
    const baseWhere = (filters ?? []).reduce(
      (acc, f) => ({ ...acc, [f.column as keyof User]: f.value }),
      {} as any,
    );

    const where = columns.map((c) => ({
      ...baseWhere,
      [c]: Raw((alias) => `CAST(${alias} AS TEXT) ILIKE :search`, {
        search: `%${search}%`,
      }),
    })) as any[];
    return this.userRepository.find({ where, take: limit });
  }

  async hashPassword(plainPass: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainPass, saltRounds);
  }

  async create(createDto: CreateUserRequestDto): Promise<User> {
    if (createDto.password) {
      createDto.password = await this.hashPassword(createDto.password);
    }
    const user = this.userRepository.create(createDto);
    return this.userRepository.save(user);
  }

  async createUserWithProfile(
    createDto: CreateUserWithProfileInput,
  ): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.userRepository.create(createDto);
      await queryRunner.manager.save(user);

      if (createDto.studentProfile) {
        const studentProfile = this.studentProfileRepository.create(
          createDto.studentProfile,
        );
        studentProfile.user = user;
        await queryRunner.manager.save(studentProfile);
      }

      if (createDto.educatorProfile) {
        const educatorProfile = this.educatorProfileRepository.create(
          createDto.educatorProfile,
        );
        educatorProfile.user = user;
        await queryRunner.manager.save(educatorProfile);
      }

      await queryRunner.commitTransaction();

      const savedUser = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['studentProfile', 'educatorProfile'],
      });
      return savedUser!;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserWithProfile(
    publicId: string,
    updateDto: UpdateUserWithProfileInput,
  ): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findOneByPublicId(publicId);
      Object.assign(user, updateDto);
      await queryRunner.manager.save(user);

      if (updateDto.studentProfile) {
        const studentProfile = this.studentProfileRepository.create(
          updateDto.studentProfile,
        );
        studentProfile.user = user;
        await queryRunner.manager.save(studentProfile);
      }

      if (updateDto.educatorProfile) {
        const educatorProfile = this.educatorProfileRepository.create(
          updateDto.educatorProfile,
        );
        educatorProfile.user = user;
        await queryRunner.manager.save(educatorProfile);
      }

      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(updateDto: UpdateUserRequestDto): Promise<User> {
    const user = await this.findOneByPublicId(updateDto.publicId);
    Object.assign(user, updateDto);
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

  // async findOneByPublicId(publicId: string): Promise<User> {
  //   const user = await this.userRepository.findOne({
  //     where: { publicId },
  //   });
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   return user;
  // }

  async findOneByPublicId(publicId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { publicId },
      relations: {
        // nested eager load :contentReference[oaicite:7]{index=7}
        studentProfile: true,
        educatorProfile: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateByPublicId(
    publicId: string,
    updateDto: UpdateUserRequestDto,
  ): Promise<User> {
    const user = await this.findOneByPublicId(publicId);

    Object.assign(user, updateDto);

    return this.userRepository.save(user);
  }

  /**
   * DELETE by publicId
   */
  async removeByPublicId(publicId: string): Promise<User> {
    const user = await this.findOneByPublicId(publicId);
    await this.userRepository.delete(user.id);
    return user;
  }

  async updateUserRolesFromArray(
    publicId: string,
    roleIds: number[],
  ): Promise<User> {
    const user = await this.findOneByPublicId(publicId);
    const roles = await this.roleRepository.find({
      where: { id: In(roleIds) },
    });
    user.roles = roles;
    return this.userRepository.save(user);
  }

  // Super admin setup needs to be reconfigured to use the above funtion instead tehn can remove the below.

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

  // /**
  //  * REMOVE ROLES
  //  */
  // async removeRoles(publicId: string, roleIds: number[]): Promise<User> {
  //   const user = await this.findOneByPublicId(publicId);
  //   user.roles = user.roles?.filter((role) => !roleIds.includes(role.id));
  //   return this.userRepository.save(user);
  // }

  async getRolesForUser(publicId: string): Promise<Role[]> {
    const user = await this.userRepository.findOne({
      where: { publicId },
      relations: ['roles'],
    });
    console.log(user?.roles);
    return user?.roles || [];
  }

  /**
   * Load user with roles, role-based permissions, and group-based permissions.
   * Then flatten all permissions into `user.combinedPermissions`.
   */
  /// USED BY RBAC GUARD DO NOT CHANGE
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
