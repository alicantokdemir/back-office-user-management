import { IBaseRepository } from '../common/base.repository';
import { Thing } from './entities/thing.entity';

export interface IThingRepository extends IBaseRepository<Thing> {}

export const IThingRepository = Symbol('IThingRepository');
