import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/user/user.service';
import { Role } from 'src/modules/rbac/sub/role/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequestDto } from 'src/modules/user/dto/req/create-user.request.dto';
import { User } from './user.model';

@Injectable()
export class BootstrapSuperAdminService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async onModuleInit(): Promise<void> {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    if (nodeEnv !== 'development') {
      return;
    }

    let superAdminRole = await this.roleRepository.findOne({
      where: { name: 'super_admin' },
    });
    if (!superAdminRole) {
      superAdminRole = this.roleRepository.create({
        name: 'super_admin',
        description: 'Super Admin Role',
      });
      await this.roleRepository.save(superAdminRole);
      console.log(`Created the "super_admin" role.`);
    }

    let superAdminUser;
    try {
      superAdminUser = await this.userRepository.findOne({
        where: { email: process.env.SUPER_ADMIN_EMAIL! },
        relations: ['roles'],
      });
    } catch (err) {
      console.log(`Dev super admin user not found`);
    }

    if (!superAdminUser) {
      const newAdminData: CreateUserRequestDto = {
        firstName: process.env.SUPER_ADMIN_EMAIL!,
        lastName: process.env.SUPER_ADMIN_LAST_NAME!,
        email: process.env.SUPER_ADMIN_EMAIL!,
        password: process.env.SUPER_ADMIN_PASSWORD!,
      };

      superAdminUser = await this.userService.create(newAdminData);
      console.log(`Created dev super admin user`);
    } else {
      console.log(`Dev super admin user already exists`);
    }

    const hasSuperAdminRole = superAdminUser.roles?.some(
      (r) => r.id === superAdminRole.id,
    );

    if (!hasSuperAdminRole) {
      await this.userService.addRoles(superAdminUser.publicId, [
        superAdminRole.id,
      ]);
      console.log(`Assigned "super_admin" role to user`);
    } else {
      console.log(`User already has the "super_admin" role.`);
    }
  }
}
