import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: Partial<UsersService>;

  beforeEach(async () => {
    userService = {
      create: jest.fn(),
      updateByPublicId: jest.fn(),
      addRoles: jest.fn(),
      removeRoles: jest.fn(),
      removeByPublicId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UsersService, useValue: userService },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  describe('create', () => {
    it('should call userService.create with the CreateUserDto and return the created user', async () => {
      const dto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        addressLine1: '123 Street',
        addressLine2: 'Apt 4',
        city: 'TestCity',
        county: 'TestCounty',
        postalCode: '12345',
        country: 'US',
        dateOfBirth: new Date('1990-01-01'),
        password: 'ComplexP@ssword123',
      };
      const mockUser = {
        ...dto,
        id: 1,
        publicId: 'abcd-1234-uuid',
      } as unknown as User;

      (userService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await resolver.create(dto);

      expect(userService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUserByPublicId', () => {
    it('should call userService.updateByPublicId and return the updated user', async () => {
      const publicId = 'abcd-1234-uuid';
      const updateDto: UpdateUserDto = {
        publicId: 'abcd-1234-uuid',
      };
      const mockUser = {
        id: 1,
        publicId,
        email: 'newemail@example.com',
        firstName: 'John',
        lastName: 'Doe',
      } as User;

      (userService.updateByPublicId as jest.Mock).mockResolvedValue(mockUser);

      const result = await resolver.updateUserByPublicId(publicId, updateDto);

      expect(userService.updateByPublicId).toHaveBeenCalledWith(
        publicId,
        updateDto,
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('addRolesToUser', () => {
    it('should call userService.addRoles with correct publicId, roleIds, and return the user', async () => {
      const publicId = 'abcd-1234';
      const roleIds = [1, 2];
      const mockUser = {
        id: 1,
        publicId,
        roles: [{ id: 1 }, { id: 2 }],
      } as unknown as User;

      (userService.addRoles as jest.Mock).mockResolvedValue(mockUser);

      const result = await resolver.addRolesToUser(publicId, roleIds);

      expect(userService.addRoles).toHaveBeenCalledWith(publicId, roleIds);
      expect(result).toEqual(mockUser);
    });
  });

  describe('removeRolesFromUser', () => {
    it('should call userService.removeRoles with correct publicId, roleIds, and return the user', async () => {
      const publicId = 'abcd-1234';
      const roleIds = [1];
      const mockUser = {
        id: 1,
        publicId,
        roles: [{ id: 2 }],
      } as unknown as User;

      (userService.removeRoles as jest.Mock).mockResolvedValue(mockUser);

      const result = await resolver.removeRolesFromUser(publicId, roleIds);

      expect(userService.removeRoles).toHaveBeenCalledWith(publicId, roleIds);
      expect(result).toEqual(mockUser);
    });
  });

  describe('removeUser', () => {
    it('should call userService.removeByPublicId and return true', async () => {
      const publicId = 'abcd-1234';
      (userService.removeByPublicId as jest.Mock).mockResolvedValue(undefined);

      const result = await resolver.removeUser(publicId);

      expect(userService.removeByPublicId).toHaveBeenCalledWith(publicId);
      expect(result).toBe(true);
    });
  });
});
