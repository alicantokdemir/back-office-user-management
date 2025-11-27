import { EntityManager } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { ITransactionManager } from '../../common/transaction-manager';
import { BaseMikroormRepository } from './repositories/base.repository';

@Injectable()
export class MikroOrmTransactionManager implements ITransactionManager {
  constructor(private readonly em: EntityManager) {}

  async saveInTransaction<T>(
    operation: () => Promise<T>,
    repos: BaseMikroormRepository<any, unknown>[] = [],
  ): Promise<T> {
    const em = this.em.fork();

    return em.transactional(async (tem: EntityManager) => {
      try {
        repos.forEach((repo) => {
          repo.setEntityManager(tem);
        });

        return await operation();
      } catch (error) {
        console.error('Rolling back transaction: ', error);
        throw error; // rollback is automatic
      } finally {
        repos.forEach((repo) => {
          repo.setEntityManager(this.em);
        });
      }
    });
  }
}
