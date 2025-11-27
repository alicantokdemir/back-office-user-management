import { IBaseRepository } from './base.repository';

export interface ITransactionManager {
  saveInTransaction<T>(
    operation: () => Promise<T>,
    repos: IBaseRepository<unknown>[],
  ): Promise<T>;
}

export const ITransactionManager = Symbol('ITransactionManager');
