import { EntityManager, FilterQuery } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { BaseMikroormRepository } from './base.repository';
import { AuthUserEntity } from '../entities/auth-user.entity';
import { AuthUser } from '../../../auth/entities/auth-user.entity';
import { IAuthUserRepository } from '../../../auth/auth.types';
import { UserEntity } from '../entities/user.entity';
import { PaginationOptions } from '../../../common/base.repository';
import { ListUsersResponseDto } from '../../../admin/dto/list-users.response.dto';

@Injectable()
export class AuthUserRepository
  extends BaseMikroormRepository<AuthUserEntity, AuthUser>
  implements IAuthUserRepository
{
  constructor(protected readonly em: EntityManager) {
    super(em, AuthUserEntity);
  }

  async findAllPaginatedWithUsers(
    pagination: PaginationOptions,
    filter?: Partial<AuthUser>,
  ): Promise<ListUsersResponseDto[]> {
    const qb = this.em
      .createQueryBuilder(AuthUserEntity, 'authUser')
      .leftJoinAndSelect('authUser.user', 'user')
      .limit(pagination.limit)
      .offset(pagination.offset);

    Object.keys(filter || {}).forEach((key) => {
      qb.andWhere({ [`${key}`]: filter[key] });
    });

    qb.orderBy({ [`${pagination.sortBy}`]: pagination.sortOrder });

    const entities = await qb.getResult();

    return entities.map((authUser) => {
      const dto = new ListUsersResponseDto();
      dto.userId = authUser.user.id;
      dto.firstName = authUser.user.firstName;
      dto.lastName = authUser.user.lastName;
      dto.email = authUser.email;
      dto.loginCount = authUser.user.loginCount;
      dto.status = authUser.user.status;
      dto.createdAt = authUser.user.createdAt;
      dto.updatedAt = authUser.user.updatedAt;
      return dto;
    });
  }

  protected mapDomainFilterToOrm(
    filter: Partial<AuthUser>,
  ): FilterQuery<AuthUserEntity> {
    const ormFilter: Partial<AuthUserEntity> = {};

    for (const [key, value] of Object.entries(filter)) {
      if (key === 'userId') {
        ormFilter.user = this.em.getReference(UserEntity, value as string);
      } else {
        ormFilter[key] = value;
      }
    }

    return ormFilter;
  }

  protected mapDomainToOrm(authUser: AuthUser): AuthUserEntity {
    const entity = new AuthUserEntity();
    if (authUser.id) {
      entity.id = authUser.id;
    }
    entity.user = this.em.getReference(UserEntity, authUser.userId);
    entity.email = authUser.email;
    entity.passwordHash = authUser.passwordHash;

    return entity;
  }
}
