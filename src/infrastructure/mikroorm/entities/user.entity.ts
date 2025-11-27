import { Entity, Enum, OneToOne, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User, UserStatus } from '../../../users/entities/user.entity';
import { AuthUserEntity } from './auth-user.entity';

@Entity({ tableName: 'user' })
export class UserEntity extends BaseEntity {
  @OneToOne(() => AuthUserEntity, { nullable: true })
  authUser: AuthUserEntity = null;

  @Property({ type: types.text, columnType: 'TEXT COLLATE NOCASE' })
  firstName!: string;

  @Property({ type: types.text, columnType: 'TEXT COLLATE NOCASE' })
  lastName!: string;

  @Enum({
    type: types.enum,
    items: () => UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @Property({ type: types.integer, defaultRaw: '0' })
  loginCount!: number;

  toObject() {
    return new User({
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      status: this.status,
      loginCount: this.loginCount,
    });
  }
}
