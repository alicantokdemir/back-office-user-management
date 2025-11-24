export type IdType = string;

export type PaginationOptions = {
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
};

export interface IBaseRepository<DomainEntity> {
  // Crud operations
  create(entity: DomainEntity): Promise<DomainEntity>;
  update(id: IdType, updateObj: Partial<DomainEntity>): Promise<DomainEntity>;
  findAllPaginated(
    pagination: PaginationOptions,
    filter?: Partial<DomainEntity>,
  ): Promise<DomainEntity[]>;
  findOneById(id: IdType): Promise<DomainEntity | null>;
  findOne(filter: Partial<DomainEntity>): Promise<DomainEntity | null>;
  remove(id: IdType): Promise<void>;
  /**
   * Returns all entities matching the filter.
   * WARNING: Only use for batch operations (export, reporting) where the result set may be large.
   */
  findAllUnpaginated(filter?: Partial<DomainEntity>): Promise<DomainEntity[]>;
  //
  count(filter?: Partial<DomainEntity>): Promise<number>;
}
