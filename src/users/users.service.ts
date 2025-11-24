import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from './user.types';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ITransactionManager } from '../common/transaction-manager';
import { LoggerService } from '../loggers/logger.service';

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

  private mapCreateUserDtoToUser(createUserDto: CreateUserDto): User {
    return new User({
      id: undefined,
      provider: createUserDto.provider,
      providerId: createUserDto.providerId,
      email: createUserDto.email,
      name: createUserDto.name,
      picture: createUserDto.picture,
      status: createUserDto.status ?? UserStatus.PENDING_VERIFICATION, // Default status
    });
  }
}
