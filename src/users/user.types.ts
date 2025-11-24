import { IBaseRepository } from '../common/base.repository';
import { User } from './entities/user.entity';

export interface IUserRepository extends IBaseRepository<User> {
  findOneByEmail(email: string): Promise<User | null>;
}

export const IUserRepository = Symbol('IUserRepository');
