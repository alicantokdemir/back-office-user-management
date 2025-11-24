export interface ITransactionManager {
  saveInTransaction<T>(operation: () => Promise<T>): Promise<T>;
}

export const ITransactionManager = Symbol('ITransactionManager');
