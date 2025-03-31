import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { Repository, In } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/modules/rbac/sub/role/role.entity';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Partial<Repository<User>>;
  let roleRepository: Partial<Repository<Role>>;

  // Example existing user
  const mockUser: User = {
    id: 1,
    publicId: 'abcd-1234',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashedPassword',
    roles: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    generatePublicId: jest.fn(),
  };

  beforeEach(async () => {
    userRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    };

    roleRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: getRepositoryToken(Role), useValue: roleRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /// COME BACK TO THIS
  //   describe('create', () => {
  //     it('should hash the password if provided, create and save the user', async () => {
  //       const createDto: CreateUserDto = {
  //         firstName: 'Alice',
  //         lastName: 'Smith',
  //         email: 'alice@example.com',
  //         phoneNumber: '555-1234',
  //         addressLine1: '123 Street',
  //         city: 'TestCity',
  //         county: 'TestCounty',
  //         postalCode: '12345',
  //         country: 'US',
  //         dateOfBirth: new Date('1985-01-01'),
  //         password: 'MyStr0ngP@ssword',
  //       };

  //       const hashSpy = jest.spyOn(bcrypt, 'hash') as jest.MockedFunction<
  //   (plaintext: string, saltOrRounds: number) => Promise<string>
  // >;

  // hashSpy.mockResolvedValue('hashed123');

  //       const hashed = 'hashed123';
  //       jest
  //         .spyOn(bcrypt, 'hash')
  //         .mockResolvedValue('hashed123' as unknown as string);
  //       (userRepository.create as jest.Mock).mockReturnValue({
  //         ...createDto,
  //         password: hashed,
  //       });
  //       (userRepository.save as jest.Mock).mockResolvedValue({
  //         ...mockUser,
  //         ...createDto,
  //         password: hashed,
  //       });

  //       const result = await service.create(createDto);

  //       expect(bcrypt.hash).toHaveBeenCalledWith('MyStr0ngP@ssword', 10);
  //       expect(userRepository.create).toHaveBeenCalledWith({
  //         ...createDto,
  //         password: hashed,
  //       });
  //       expect(userRepository.save).toHaveBeenCalled();
  //       expect(result.password).toBe(hashed);
  //     });

  //     it('should skip hashing if no password provided', async () => {
  //       const createDto = {
  //         firstName: 'Bob',
  //         lastName: 'Jones',
  //         email: 'bob@example.com',
  //       } as CreateUserDto;

  //       (userRepository.create as jest.Mock).mockReturnValue(createDto);
  //       (userRepository.save as jest.Mock).mockResolvedValue({
  //         ...mockUser,
  //         ...createDto,
  //       });

  //       const result = await service.create(createDto);
  //       expect(bcrypt.hash).not.toHaveBeenCalled();
  //       expect(userRepository.create).toHaveBeenCalledWith(createDto);
  //       expect(result.email).toBe('bob@example.com');
  //     });
  //   });

  describe('findOneByEmail', () => {
    it('should return user if found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const found = await service.findOneByEmail('john@example.com');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(found).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.findOneByEmail('missing@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByPublicId', () => {
    it('should return user if found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const found = await service.findOneByPublicId('abcd-1234');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { publicId: 'abcd-1234' },
      });
      expect(found).toBe(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOneByPublicId('nope-0000')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateByPublicId', () => {
    it('should find user, merge updates, save', async () => {
      // Provide the publicId to match your UpdateUserDto shape
      const updateDto: UpdateUserDto = {
        publicId: 'abcd-1234',
        email: 'new@example.com',
      };

      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.save as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: updateDto.email,
      });

      const result = await service.updateByPublicId('abcd-1234', updateDto);
      expect(result.email).toBe('new@example.com');
    });
  });

  describe('removeByPublicId', () => {
    it('should find user by publicId, then delete by numeric id', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await service.removeByPublicId('abcd-1234');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { publicId: 'abcd-1234' },
      });
      expect(userRepository.delete).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('addRoles', () => {
    it('should find user by publicId, fetch roles, merge, and save', async () => {
      const roleIds = [10, 11];
      (userRepository.findOne as jest.Mock).mockResolvedValue({
        ...mockUser,
        roles: [],
      });
      const mockRoles = [{ id: 10 }, { id: 11 }];
      (roleRepository.find as jest.Mock).mockResolvedValue(mockRoles);
      (userRepository.save as jest.Mock).mockResolvedValue({
        ...mockUser,
        roles: mockRoles,
      });

      const result = await service.addRoles('abcd-1234', roleIds);
      expect(roleRepository.find).toHaveBeenCalledWith({
        where: { id: In(roleIds) },
      });
      expect(result.roles).toEqual(mockRoles);
    });
  });

  describe('removeRoles', () => {
    it('should filter out specified roles and save', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue({
        ...mockUser,
        roles: [{ id: 10 }, { id: 20 }, { id: 30 }],
      });
      (userRepository.save as jest.Mock).mockResolvedValue({
        ...mockUser,
        roles: [{ id: 30 }],
      });

      const result = await service.removeRoles('abcd-1234', [10, 20]);
      expect(result.roles).toEqual([{ id: 30 }]);
    });
  });

  describe('getUserWithRolesAndPermissions', () => {
    it('should return user with roles/permissions if found', async () => {
      const userWithRoles = {
        ...mockUser,
        roles: [{ id: 1, permissions: [{ id: 1, name: 'perm1' }] }],
      };
      (userRepository.findOne as jest.Mock).mockResolvedValue(userWithRoles);

      const found = await service.getUserWithRolesAndPermissions('abcd-1234');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { publicId: 'abcd-1234' },
        relations: ['roles', 'roles.permissions'],
      });
      expect(found.roles?.[0].permissions?.[0].name).toBe('perm1');
    });

    it('should throw NotFoundException if user not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.getUserWithRolesAndPermissions('missing-9999'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
