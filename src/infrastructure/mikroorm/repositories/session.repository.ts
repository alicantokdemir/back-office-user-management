import { EntityManager, FilterQuery } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { BaseMikroormRepository } from './base.repository';
import { SessionEntity } from '../entities/session.entity';
import { UserEntity } from '../entities/user.entity';
import { Session } from '../../../sessions/entities/session.entity';
import { ISessionRepository } from '../../../sessions/session.types';

@Injectable()
export class SessionRepository
  extends BaseMikroormRepository<SessionEntity, Session>
  implements ISessionRepository
{
  constructor(protected readonly em: EntityManager) {
    super(em, SessionEntity);
  }

  protected mapDomainFilterToOrm(
    filter: Partial<Session>,
  ): FilterQuery<SessionEntity> {
    const ormFilter: Partial<SessionEntity> = {};

    for (const [key, value] of Object.entries(filter)) {
      if (key === 'userId') {
        ormFilter.user = this.em.getReference(UserEntity, value as string);
      } else {
        ormFilter[key] = value;
      }
    }

    return ormFilter;
  }

  protected mapDomainToOrm(session: Session): SessionEntity {
    const entity = new SessionEntity();
    if (session.id) {
      entity.id = session.id;
    }
    entity.user = this.em.getReference(UserEntity, session.userId);
    entity.expiresAt = session.expiresAt;
    entity.refreshTokenHash = session.refreshTokenHash;
    entity.ipAddress = session.ipAddress;
    entity.userAgent = session.userAgent;

    return entity;
  }
}
