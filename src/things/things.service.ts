import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { IThingRepository } from './things.types';
import { ITransactionManager } from '../common/transaction-manager';
import { Thing } from './entities/thing.entity';
import { IdType } from '../common/base.repository';
import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  PaginationResult,
} from '../common/pagination';
import { ListThingDto } from './dto/list-thing.dto';
import { UpsertThingDto } from './dto/upsert-thing.dto';
import { LoggerService } from '../loggers/logger.service';

@Injectable()
export class ThingsService {
  constructor(
    @Inject(IThingRepository)
    private readonly thingRepository: IThingRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ThingsService.name);
  }

  async create(upsertThingDto: UpsertThingDto): Promise<Thing> {
    this.logger.log(
      `Creating thing with data: ${JSON.stringify(upsertThingDto)}`,
    );

    const thing = await this.transactionManager.saveInTransaction(async () => {
      return this.thingRepository.create(
        this.mapUpsertThingDtoToThing(upsertThingDto),
      );
    });

    this.logger.log(`Thing created with ID: ${thing.id}`);

    return thing;
  }

  async update(id: IdType, upsertThingDto: UpsertThingDto): Promise<Thing> {
    this.logger.log(
      `Updating thing ID ${id} with data: ${JSON.stringify(upsertThingDto)}`,
    );

    const thing = await this.transactionManager.saveInTransaction(async () => {
      return this.thingRepository.update(
        id,
        this.mapUpsertThingDtoToThing(upsertThingDto),
      );
    });

    this.logger.log(`Thing updated with ID: ${thing.id}`);

    return thing;
  }

  async list(listThingDto: ListThingDto): Promise<PaginationResult<Thing>> {
    const { page, itemsPerPage, sortBy, sortOrder, ...filter } = listThingDto;

    this.logger.log(
      `Listing things with filters: ${JSON.stringify(
        filter,
      )}, page: ${page}, itemsPerPage: ${itemsPerPage}, sortBy: ${sortBy}, sortOrder: ${sortOrder}`,
    );

    const validSortFields = ['createdAt', 'updatedAt'];

    if (sortBy && !validSortFields.includes(sortBy)) {
      throw new BadRequestException(`Invalid sortBy field: ${sortBy}`);
    }

    const getCount = this.thingRepository.count(filter);

    const paginationOptions = {
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
      sortBy: sortBy ?? DEFAULT_SORT_BY,
      sortOrder: sortOrder ?? DEFAULT_SORT_ORDER,
    };

    const getThings = this.thingRepository.findAllPaginated(
      paginationOptions,
      filter,
    );

    return Promise.all([getCount, getThings]).then(([totalItems, items]) => {
      return new PaginationResult<Thing>({
        itemsPerPage,
        currentPage: page,
        totalItems,
        items,
        sortBy: paginationOptions.sortBy,
        sortOrder: paginationOptions.sortOrder,
      });
    });
  }

  findOneById(id: IdType): Promise<Thing | null> {
    this.logger.log(`Finding thing by ID: ${id}`);
    return this.thingRepository.findOneById(id);
  }

  remove(id: IdType) {
    this.logger.log(`Removing thing by ID: ${id}`);
    return this.thingRepository.remove(id);
  }

  private mapUpsertThingDtoToThing(upsertThingDto: UpsertThingDto): Thing {
    let dataString: string;

    try {
      dataString = JSON.stringify(upsertThingDto.data);
    } catch {
      throw new BadRequestException('Invalid data format');
    }

    return new Thing({
      data: dataString,
    });
  }
}
