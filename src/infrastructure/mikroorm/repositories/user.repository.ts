import { EntityManager } from '@mikro-orm/sqlite';
import { IUserRepository } from '../../../users/user.types';
import { Injectable } from '@nestjs/common';
import { User } from '../../../users/entities/user.entity';
import { UserEntity } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository
  extends BaseRepository<UserEntity, User>
  implements IUserRepository
{
  constructor(protected readonly em: EntityManager) {
    super(em, UserEntity);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }
}
