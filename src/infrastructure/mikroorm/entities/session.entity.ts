import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { Session } from '../../../sessions/entities/session.entity';

@Entity({ tableName: 'session' })
export class SessionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { nullable: false })
  user!: UserEntity;

  @Property({ type: types.datetime })
  expiresAt!: Date;

  @Property({ type: types.text })
  refreshTokenHash!: string;

  @Property({ type: types.text })
  ipAddress!: string;

  @Property({ type: types.text })
  userAgent!: string;

  toObject() {
    return new Session({
      id: this.id,
      userId: this.user.id,
      expiresAt: this.expiresAt,
      refreshTokenHash: this.refreshTokenHash,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
    });
  }
}
