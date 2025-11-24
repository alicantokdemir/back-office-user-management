import { EntityManager } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { ITransactionManager } from '../../common/transaction-manager';

@Injectable()
export class MikroOrmTransactionManager implements ITransactionManager {
  constructor(private readonly em: EntityManager) {}

  async saveInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    return this.em.transactional(async () => {
      try {
        return await operation();
      } catch (error) {
        console.error('Rolling back transaction: ', error);
        throw error; // rollback is automatic
      }
    });
  }
}
