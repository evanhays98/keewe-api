import { UsersService } from '../UserService';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../../entities/UserEntity';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const usersRepositoryMock = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: usersRepositoryMock, // Provide your mock repository here
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a user with valid credentials', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(new UserEntity());

    const user = await service.create({
      mail: 'test@mail.com',
      username: 'testuser',
      password: 'password123!',
    });

    expect(user).toBeDefined();
  });

  it('should throw error when creating a user with invalid email', async () => {
    await expect(
      service.create({
        mail: 'invalidmail',
        username: 'testuser',
        password: 'password123!',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error when creating a user with username as email', async () => {
    await expect(
      service.create({
        mail: 'test@mail.com',
        username: 'test@mail.com',
        password: 'password123!',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error when creating a user with short password', async () => {
    await expect(
      service.create({
        mail: 'test@mail.com',
        username: 'testuser',
        password: 'short',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error when creating a user with username containing special characters', async () => {
    await expect(
      service.create({
        mail: 'test@mail.com',
        username: 'testuser$',
        password: 'password123!',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error when creating a user with password without special characters', async () => {
    await expect(
      service.create({
        mail: 'test@mail.com',
        username: 'testuser',
        password: 'password',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
