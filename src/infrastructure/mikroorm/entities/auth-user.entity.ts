import {
  Entity,
  Property,
  types,
  OneToOne,
  BeforeCreate,
  BeforeUpdate,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { AuthUser } from '../../../auth/entities/auth-user.entity';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'auth_user' })
export class AuthUserEntity extends BaseEntity {
  @OneToOne(() => UserEntity, { nullable: false })
  user!: UserEntity;

  @Property({
    type: types.text,
    unique: true,
    columnType: 'TEXT COLLATE NOCASE',
  })
  email!: string;

  @Property({ type: types.text })
  passwordHash!: string;

  @BeforeCreate()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }

  toObject() {
    return new AuthUser({
      id: this.id,
      userId: this.user.id,
      email: this.email,
      passwordHash: this.passwordHash,
    });
  }
}
