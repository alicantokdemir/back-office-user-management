import { IBaseRepository } from '../common/base.repository';
import { Session } from './entities/session.entity';

export interface ISessionRepository extends IBaseRepository<Session> {}
export const ISessionRepository = Symbol('ISessionRepository');
