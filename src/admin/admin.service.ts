import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoggerService } from '../loggers/logger.service';
import { UsersService } from '../users/users.service';

import { ISessionRepository } from '../sessions/session.types';
import { ITransactionManager } from '../common/transaction-manager';
import { IUserRepository } from '../users/user.types';
import { SessionsService } from '../sessions/sessions.service';
import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  PaginationResult,
} from '../common/pagination';
import { ListUsersResponseDto } from './dto/list-users.response.dto';
import { IAuthUserRepository } from '../auth/auth.types';
import { ListUserDto } from './dto/list-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashSecret } from '../common/helper';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AdminService {
  constructor(
    @Inject(IAuthUserRepository)
    private readonly authUserRepository: IAuthUserRepository,
    @Inject(ISessionRepository)
    private readonly sessionRepository: ISessionRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {
    this.logger.setContext(AdminService.name);
  }

  async listUsers(
    listUserDto: ListUserDto,
  ): Promise<PaginationResult<ListUsersResponseDto>> {
    const { page, itemsPerPage, sortBy, sortOrder, ...filter } = listUserDto;

    this.logger.log(
      `Listing users with filters: ${JSON.stringify(
        filter,
      )}, page: ${page}, itemsPerPage: ${itemsPerPage}, sortBy: ${sortBy}, sortOrder: ${sortOrder}`,
    );

    const validSortFields = [
      'email',
      'createdAt',
      'updatedAt',
      'user.firstName',
      'user.lastName',
      'user.status',
      'user.loginCount',
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

    const getData = this.authUserRepository.findAllPaginatedWithUsers(
      paginationOptions,
      filter,
    );

    try {
      return Promise.all([getCount, getData]).then(([totalItems, items]) => {
        return new PaginationResult<ListUsersResponseDto>({
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

  async deleteUserById(userId: string): Promise<void> {
    this.logger.log(`Deleting user with ID: ${userId}`);

    try {
      await this.transactionManager.saveInTransaction(
        async (repos) => {
          await Promise.all([
            repos[0].removeAll({ userId }),
            repos[1].removeAll({ userId }),
            repos[2].remove(userId),
          ]);
        },
        [this.sessionRepository, this.authUserRepository, this.userRepository],
      );
      this.logger.log(`User with ID: ${userId} deleted successfully`);
    } catch (err) {
      this.logger.error(`Failed to delete user with ID: ${userId}`, err);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    this.logger.log(`Updating user with ID: ${userId}`);

    try {
      const updateData: Partial<UpdateUserDto> = { ...updateUserDto };

      if (updateUserDto.password) {
        updateData.password = await hashSecret(updateUserDto.password);
      }

      const updatedUser = {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        status: updateUserDto.status,
      };

      const updatedAuthUser = {
        email: updateUserDto.email,
        password: updateData.password,
      };

      const authUser = await this.authUserRepository.findOne({ userId });
      if (!authUser) {
        throw new BadRequestException('Auth user not found');
      }

      await this.transactionManager.saveInTransaction(
        async (repos) => {
          await Promise.all([
            repos[0].update(userId, updatedUser),
            repos[1].update(authUser.id, updatedAuthUser),
          ]);
        },
        [this.userRepository, this.authUserRepository],
      );

      this.logger.log(`User with ID: ${userId} updated successfully`);
    } catch (err) {
      this.logger.error(`Failed to update user with ID: ${userId}`, err);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    this.logger.log(`Creating new user with email: ${createUserDto.email}`);

    try {
      await this.authService.register({
        email: createUserDto.email,
        password: createUserDto.password,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        status: createUserDto.status,
      });

      this.logger.log(
        `User with email: ${createUserDto.email} created successfully`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to create user with email: ${createUserDto.email}`,
        err,
      );
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
