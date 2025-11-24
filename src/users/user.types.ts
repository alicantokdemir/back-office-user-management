import { IBaseRepository } from '../common/base.repository';
import { User } from './entities/user.entity';

export interface IUserRepository extends IBaseRepository<User> {}

export const IUserRepository = Symbol('IUserRepository');
