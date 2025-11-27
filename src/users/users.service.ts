import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUserRepository } from './user.types';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggerService } from '../loggers/logger.service';
import { ListUserDto } from './dto/list-user.dto';
import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  PaginationResult,
} from '../common/pagination';
import { IdType } from '../common/base.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUserRepository)
    public readonly userRepository: IUserRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async findOneById(id: string): Promise<User | null> {
    try {
      this.logger.log(`Finding user by ID: ${id}`);
      return this.userRepository.findOneById(id);
    } catch (err) {
      this.logger.error(`Failed to find user by ID: ${id}`, err);

      throw new InternalServerErrorException();
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.log(
        `Creating user with data: ${JSON.stringify(createUserDto)}`,
      );

      const user = await this.userRepository.create(
        this.mapCreateUserDtoToUser(createUserDto),
      );

      this.logger.log(`User created with ID: ${user.id}`);

      return user;
    } catch (err) {
      this.logger.error('Failed to create user', err);

      throw new InternalServerErrorException();
    }
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

    try {
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
    } catch (err) {
      this.logger.error('Failed to list users', err);

      throw new InternalServerErrorException();
    }
  }

  async update(id: IdType, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      this.logger.log(
        `Updating user ID ${id} with data: ${JSON.stringify(updateUserDto)}`,
      );

      const user = await this.userRepository.update(id, updateUserDto);

      this.logger.log(`User updated with ID: ${user.id}`);

      return user;
    } catch (err) {
      this.logger.error(`Failed to update user ID ${id}`, err);

      throw new InternalServerErrorException();
    }
  }

  async remove(id: IdType) {
    try {
      this.logger.log(`Removing user by ID: ${id}`);
      return this.userRepository.remove(id);
    } catch (err) {
      this.logger.error(`Failed to remove user by ID: ${id}`, err);

      throw new InternalServerErrorException();
    }
  }

  async validateUser(userId: string) {
    try {
      const user = await this.findOneById(userId);

      if (!user || user.status === UserStatus.INACTIVE) {
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error(`Error validating user ID ${userId}: ${error}`);
      throw new InternalServerErrorException('Error validating user');
    }
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
