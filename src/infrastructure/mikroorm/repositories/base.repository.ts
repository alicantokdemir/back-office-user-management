import {
  EntityClass,
  EntityManager,
  FilterQuery,
  OrderDefinition,
  Populate,
  RequiredEntityData,
} from '@mikro-orm/core';
import {
  IBaseRepository,
  IdType,
  PaginationOptions,
} from '../../../common/base.repository';

export abstract class BaseMikroormRepository<
  DbEntity extends { id: IdType; toObject: () => DomainEntity },
  DomainEntity extends RequiredEntityData<DbEntity>,
> implements IBaseRepository<DomainEntity>
{
  protected constructor(
    protected em: EntityManager,
    protected readonly dbEntity: EntityClass<DbEntity>,
  ) {}

  withEm(em: EntityManager) {
    const repo = Object.create(this);
    repo.em = em;
    return repo;
  }

  protected abstract mapDomainFilterToOrm(filter: Partial<DomainEntity>);

  protected abstract mapDomainToOrm(entity: DomainEntity): DbEntity;

  async create(newObj: DomainEntity): Promise<DomainEntity> {
    const obj = this.em.create(this.dbEntity, this.mapDomainToOrm(newObj));
    await this.em.persistAndFlush(obj);

    return obj.toObject();
  }

  async findAllUnpaginated(
    filter?: Partial<DomainEntity>,
  ): Promise<DomainEntity[]> {
    const ormFilter = this.mapDomainFilterToOrm(filter);

    const entities = await this.em.find(this.dbEntity, ormFilter ?? {});

    return entities.map((entity) => entity.toObject());
  }

  async findAllPaginated(
    pagination: PaginationOptions,
    filter?: Partial<DomainEntity>,
  ): Promise<DomainEntity[]> {
    const ormFilter = this.mapDomainFilterToOrm(filter);

    const entities = await this.em.find(this.dbEntity, ormFilter ?? {}, {
      limit: pagination.limit,
      offset: pagination.offset,
      orderBy: {
        [pagination.sortBy]: pagination.sortOrder,
      } as OrderDefinition<DbEntity>,
    });

    return entities.map((entity) => entity.toObject());
  }

  async findOne(filter: Partial<DomainEntity>): Promise<DomainEntity | null> {
    const ormFilter = this.mapDomainFilterToOrm(filter);

    const entity = await this.em.findOne(this.dbEntity, ormFilter);

    return entity?.toObject() ?? null;
  }

  async findOneById(id: IdType): Promise<DomainEntity | null> {
    const entity = await this.em.findOne(this.dbEntity, {
      id,
    } as FilterQuery<DbEntity>);

    return entity?.toObject() ?? null;
  }

  async update(
    id: IdType,
    updateObj: Partial<DomainEntity>,
  ): Promise<DomainEntity> {
    const entity = await this.em.findOne(this.dbEntity, {
      id,
    } as FilterQuery<DbEntity>);

    if (!entity) {
      throw new Error(`${this.dbEntity.name} not found`);
    }

    Object.assign(entity, updateObj);

    await this.em.persistAndFlush(entity);

    return entity.toObject();
  }

  async removeAll(filter?: Partial<DomainEntity>): Promise<number> {
    const ormFilter = this.mapDomainFilterToOrm(filter);

    const deleted = await this.em.nativeDelete(
      this.dbEntity,
      ormFilter as FilterQuery<DbEntity>,
    );

    return deleted;
  }

  async remove(id: IdType): Promise<boolean> {
    const deleted = await this.em.nativeDelete(this.dbEntity, {
      id,
    } as FilterQuery<DbEntity>);

    return deleted > 0;
  }

  async count(filter?: Partial<DomainEntity>): Promise<number> {
    return this.em.count(
      this.dbEntity,
      (filter as FilterQuery<DbEntity>) ?? {},
    );
  }
}
