import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import isEmail from 'validator/lib/isEmail';
import { UserEntity } from '../entities/UserEntity';
import { RegisterUserDto } from '../dtos';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { mail, username, password } = registerUserDto;
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const userExists = await this.repo.findOne({ where: { mail, username } });

    if (!isEmail(mail)) throw new BadRequestException('Mail is not an email');
    if (isEmail(username))
      throw new BadRequestException('Username cannot be an email');
    if (userExists) throw new BadRequestException('User already exists');
    if (password.length < 7)
      throw new BadRequestException('Password is too short (min 7 chars)');
    if (specialCharsRegex.test(username))
      throw new BadRequestException(
        'Username cannot contain special characters',
      );
    if (username.length > 20)
      throw new BadRequestException('Username too long (max 20 chars)');
    if (!specialCharsRegex.test(password))
      throw new BadRequestException(
        'Password must contain at least one special character',
      );

    const newUser = this.repo.create({ mail, username, password });
    return this.repo.save(newUser);
  }

  async findByIdentifier(identifier: string): Promise<UserEntity> {
    return (
      (await this.repo.findOne({
        where: {
          mail: identifier,
        },
      })) ||
      this.repo.findOne({
        where: {
          username: identifier,
        },
      })
    );
  }

  async findAllExceptMe(userId: string): Promise<UserEntity[]> {
    return this.repo.find({
      where: {
        id: Not(userId),
      },
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }
}
