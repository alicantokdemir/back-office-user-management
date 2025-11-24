import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserRepository } from './user.types';
import { ITransactionManager } from '../common/transaction-manager';
import { mockBaseRepository } from '../../test/mocks/baseRepository';
import { mockTransactionManager } from '../../test/mocks/transactionManager';
import { mockLoggerService } from '../../test/mocks/loggerService';
import { LoggerService } from '../loggers/logger.service';
import { ListUserDto } from './dto/list-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: IUserRepository = Object.assign(
    {},
    mockBaseRepository,
    {
      findOneByEmail: jest.fn(),
    },
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UsersService,
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: ITransactionManager,
          useValue: mockTransactionManager,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set context to logger', () => {
    expect(mockLoggerService.setContext).toHaveBeenCalledWith(
      UsersService.name,
    );
  });

  describe('create', () => {
    it('should create a new user with default values', async () => {
      const dto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        status: UserStatus.INACTIVE,
      };

      // @ts-ignore: Accessing private method for test
      const user: User = service['mapCreateUserDtoToUser'](dto);

      const result = await service.create(dto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(user);
      expect(result).toBeDefined();
      expect(result.firstName).toBe(dto.firstName);
      expect(result.lastName).toBe(dto.lastName);
      expect(result.status).toBe(dto.status);
      expect(result.loginCount).toBe(0);
      expect(result.id).toBeTruthy();
    });
  });

  describe('list', () => {
    it('should list all the users with pagination', async () => {
      const dto: ListUserDto = {
        page: 2,
        itemsPerPage: 6,
        sortBy: 'firstName',
        sortOrder: 'ASC',
      };

      const result = await service.list(dto);

      expect(mockUserRepository.count).toHaveBeenCalledWith({});
      expect(mockUserRepository.findAllPaginated).toHaveBeenCalledWith(
        {
          limit: dto.itemsPerPage,
          offset: (dto.page - 1) * dto.itemsPerPage,
          sortBy: dto.sortBy,
          sortOrder: dto.sortOrder,
        },
        {},
      );
      expect(result).toBeDefined();
    });
  });

  describe('mapCreateUserDtoToUser', () => {
    it('should map CreateUserDto to User correctly', () => {
      const dto: CreateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        status: UserStatus.ACTIVE,
      };
      // @ts-ignore: Accessing private method for test
      const user: User = service['mapCreateUserDtoToUser'](dto);

      expect(user.firstName).toBe(dto.firstName);
      expect(user.lastName).toBe(dto.lastName);
      expect(user.status).toBe(dto.status);
      expect(user.loginCount).toBe(0);
    });
  });
});
