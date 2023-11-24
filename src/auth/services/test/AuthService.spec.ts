import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../AuthService';
import { UsersService } from '../UserService';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../entities/UserEntity';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const usersServiceMock = {
      findByIdentifier: jest.fn(),
      create: jest.fn(),
    };

    const jwtServiceMock = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should validate login with correct credentials', async () => {
    const user = new UserEntity();
    user.password = crypto
      .createHmac('sha256', 'salt' + 'password')
      .digest('hex');
    user.salt = 'salt';

    jest.spyOn(usersService, 'findByIdentifier').mockResolvedValue(user);

    const result = await authService.validateLogin('identifier', 'password');

    expect(result).toEqual(user);
  });

  it('should throw error when validating login with incorrect credentials', async () => {
    const user = new UserEntity();
    user.password = crypto
      .createHmac('sha256', 'salt' + 'password')
      .digest('hex');
    user.salt = 'salt';

    jest.spyOn(usersService, 'findByIdentifier').mockResolvedValue(user);

    await expect(
      authService.validateLogin('identifier', 'wrongpassword'),
    ).rejects.toThrow();
  });

  it('should return access token and user info when logging in user', async () => {
    const user = new UserEntity();
    user.id = uuidv4();
    user.username = 'username';
    user.mail = 'mail@mail.com';

    jest.spyOn(jwtService, 'sign').mockReturnValue('token');

    const result = await authService.loginUser(user);

    expect(result).toEqual({
      access_token: 'token',
      userInfo: user,
    });
  });

  it('should throw error when logging in with incorrect credentials', async () => {
    const user = new UserEntity();
    user.password = crypto
      .createHmac('sha256', 'salt' + 'password')
      .digest('hex');
    user.salt = 'salt';

    jest.spyOn(usersService, 'findByIdentifier').mockResolvedValue(user);

    await expect(
      authService.login({
        identifier: 'identifier',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow();
  });

  it('should return access token and user info when signing up', async () => {
    const user = new UserEntity();
    user.id = uuidv4();
    user.username = 'username';
    user.mail = 'mail@mail.com';

    jest.spyOn(usersService, 'create').mockResolvedValue(user);
    jest.spyOn(jwtService, 'sign').mockReturnValue('token');

    const result = await authService.signup({
      username: 'username',
      password: 'password',
      mail: 'mail@mail.com',
    });

    expect(result).toEqual({
      access_token: 'token',
      userInfo: user,
    });
  });
});
