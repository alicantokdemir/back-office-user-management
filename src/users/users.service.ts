import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from './user.types';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ITransactionManager } from '../common/transaction-manager';
import { LoggerService } from '../loggers/logger.service';
import { ListUserDto } from './dto/list-user.dto';
import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  PaginationResult,
} from '../common/pagination';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async findOne(email: string): Promise<User | undefined> {
    this.logger.log(`Finding user by email: ${email}`);
    return this.userRepository.findOneByEmail(email);
  }

  async findOneById(id: string): Promise<User | null> {
    this.logger.log(`Finding user by ID: ${id}`);
    return this.userRepository.findOneById(id);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    this.logger.log(`Finding user by email: ${email}`);
    return this.userRepository.findOneByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(
      `Creating user with data: ${JSON.stringify(createUserDto)}`,
    );

    const user = await this.transactionManager.saveInTransaction(async () => {
      return this.userRepository.create(
        this.mapCreateUserDtoToUser(createUserDto),
      );
    });

    this.logger.log(`User created with ID: ${user.id}`);

    return user;
  }

  async list(listUserDto: ListUserDto): Promise<PaginationResult<User>> {
    const { page, itemsPerPage, sortBy, sortOrder, ...filter } = listUserDto;

    this.logger.log(
      `Listing users with filters: ${JSON.stringify(
        filter,
      )}, page: ${page}, itemsPerPage: ${itemsPerPage}, sortBy: ${sortBy}, sortOrder: ${sortOrder}`,
    );

    const validSortFields = [
      'createdAt',
      'updatedAt',
      'firstName',
      'lastName',
      'status',
    ];

    if (sortBy && !validSortFields.includes(sortBy)) {
      throw new BadRequestException(`Invalid sortBy field: ${sortBy}`);
    }

    const paginationOptions = {
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
      sortBy: sortBy ?? DEFAULT_SORT_BY,
      sortOrder: sortOrder ?? DEFAULT_SORT_ORDER,
    };

    const getCount = this.userRepository.count(filter);

    const getData = this.userRepository.findAllPaginated(
      paginationOptions,
      filter,
    );

    return Promise.all([getCount, getData]).then(([totalItems, items]) => {
      return new PaginationResult<User>({
        itemsPerPage,
        currentPage: page,
        totalItems,
        items,
        sortBy: paginationOptions.sortBy,
        sortOrder: paginationOptions.sortOrder,
      });
    });
  }

  private mapCreateUserDtoToUser(createUserDto: CreateUserDto): User {
    return new User({
      id: undefined,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      status: createUserDto.status,
      loginCount: 0,
    });
  }
}
