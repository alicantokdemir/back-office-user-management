import { IBaseRepository } from './base.repository';

export interface ITransactionManager {
  saveInTransaction<T>(
    operation: (repoInstances: IBaseRepository<unknown>[]) => Promise<T>,
    repos: IBaseRepository<unknown>[],
  ): Promise<T>;
}

export const ITransactionManager = Symbol('ITransactionManager');
