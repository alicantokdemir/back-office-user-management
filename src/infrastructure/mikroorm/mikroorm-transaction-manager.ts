import { EntityManager } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { ITransactionManager } from '../../common/transaction-manager';
import { BaseMikroormRepository } from './repositories/base.repository';
import { IBaseRepository } from '../../common/base.repository';

@Injectable()
export class MikroOrmTransactionManager implements ITransactionManager {
  constructor(private readonly em: EntityManager) {}

  async saveInTransaction<T>(
    operation: (repoInstances: IBaseRepository<unknown>[]) => Promise<T>,
    repos: BaseMikroormRepository<any, unknown>[] = [],
  ): Promise<T> {
    const em = this.em.fork();

    return em.transactional(async (tem: EntityManager) => {
      try {
        const repoInstances = [];
        repos.forEach((repo) => {
          repoInstances.push(repo.withEm(tem));
        });

        return await operation(repoInstances);
      } catch (error) {
        console.error('Rolling back transaction: ', error);
        throw error; // rollback is automatic
      }
    });
  }
}
