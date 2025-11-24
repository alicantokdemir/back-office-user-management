import {
  EntityClass,
  EntityManager,
  FilterQuery,
  OrderDefinition,
  RequiredEntityData,
} from '@mikro-orm/core';
import {
  IBaseRepository,
  IdType,
  PaginationOptions,
} from '../../../common/base.repository';

export abstract class BaseRepository<
  DbEntity extends { id: IdType; toObject: () => DomainEntity },
  DomainEntity extends RequiredEntityData<DbEntity>,
> implements IBaseRepository<DomainEntity>
{
  protected constructor(
    protected readonly em: EntityManager,
    protected readonly dbEntity: EntityClass<DbEntity>,
  ) {}

  async create(newObj: DomainEntity): Promise<DomainEntity> {
    const obj = this.em.create(this.dbEntity, newObj);
    this.em.persistAndFlush(obj);

    return obj.toObject();
  }

  async findAllUnpaginated(
    filter?: Partial<DomainEntity>,
  ): Promise<DomainEntity[]> {
    const entities = await this.em.find(
      this.dbEntity,
      (filter as FilterQuery<DbEntity>) ?? {},
    );

    return entities.map((entity) => entity.toObject());
  }

  async findAllPaginated(
    pagination: PaginationOptions,
    filter?: Partial<DomainEntity>,
  ): Promise<DomainEntity[]> {
    const entities = await this.em.find(
      this.dbEntity,
      (filter as FilterQuery<DbEntity>) ?? {},
      {
        limit: pagination.limit,
        offset: pagination.offset,
        orderBy: {
          [pagination.sortBy]: pagination.sortOrder,
        } as OrderDefinition<DbEntity>,
      },
    );

    return entities.map((entity) => entity.toObject());
  }

  async findOne(filter: Partial<DomainEntity>): Promise<DomainEntity | null> {
    const entity = await this.em.findOne(
      this.dbEntity,
      filter as FilterQuery<DbEntity>,
    );

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

    this.em.persistAndFlush(entity);

    return entity.toObject();
  }

  async remove(id: IdType): Promise<void> {
    await this.em.nativeDelete(this.dbEntity, { id } as FilterQuery<DbEntity>);
  }

  async count(filter?: Partial<DomainEntity>): Promise<number> {
    return this.em.count(
      this.dbEntity,
      (filter as FilterQuery<DbEntity>) ?? {},
    );
  }
}
