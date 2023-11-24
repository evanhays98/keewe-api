import { BeforeInsert, Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../libs/entities/BaseEntity';
import * as crypto from 'crypto';

@Entity()
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  salt: string;

  @Column({ unique: true })
  mail: string;

  @Column()
  @Exclude()
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto
      .createHmac('sha256', this.salt + this.password)
      .digest('hex');
  }
}
