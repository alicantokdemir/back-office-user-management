import { Entity, Enum, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User, UserStatus } from '../../../users/entities/user.entity';

@Entity({ tableName: 'user' })
export class UserEntity extends BaseEntity {
  @Property({ type: types.text })
  provider!: string;

  @Property({ type: types.text })
  providerId!: string;

  @Property({ type: types.text })
  email!: string;

  @Enum({
    type: types.enum,
    items: () => UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @Property({ type: types.text, nullable: true })
  name?: string;

  @Property({ type: types.text, nullable: true })
  picture?: string;

  toObject() {
    return new User({
      id: this.id,
      provider: this.provider,
      providerId: this.providerId,
      email: this.email,
      name: this.name,
      picture: this.picture,
      status: this.status,
    });
  }
}
