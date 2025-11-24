import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserRepository } from './user.types';
import { ITransactionManager } from '../common/transaction-manager';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: IUserRepository = {
    create: jest.fn(),
    findAllPaginated: jest.fn(),
    findAllUnpaginated: jest.fn(),
    findOneById: jest.fn(),
    findOne: jest.fn(),
    findOneByEmail: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  let mockTransactionManager: ITransactionManager = {
    saveInTransaction: jest.fn(),
  };

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
      ],
    }).compile();

    (mockTransactionManager.saveInTransaction as jest.Mock).mockImplementation(
      async (cb: any) => cb(),
    );

    service = module.get<UsersService>(UsersService);

    jest.useFakeTimers();
    jest.setSystemTime(new Date('20 Aug 2020 00:12:00 GMT').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with default values', async () => {
      const dto: CreateUserDto = {
        provider: 'google',
        providerId: '123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'pic.jpg',
        status: null,
      };

      // @ts-ignore: Accessing private method for test
      const user: User = service['mapCreateUserDtoToUser'](dto);

      const result = await service.create(dto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(user);
      expect(user.status).toBe(UserStatus.PENDING_VERIFICATION);
    });
  });

  describe('mapCreateUserDtoToUser', () => {
    it('should map CreateUserDto to User correctly', () => {
      const dto: CreateUserDto = {
        provider: 'google',
        providerId: '123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'pic.jpg',
        status: UserStatus.ACTIVE,
      };
      // @ts-ignore: Accessing private method for test
      const user: User = service['mapCreateUserDtoToUser'](dto);

      expect(user.provider).toBe(dto.provider);
      expect(user.providerId).toBe(dto.providerId);
      expect(user.email).toBe(dto.email);
      expect(user.name).toBe(dto.name);
      expect(user.picture).toBe(dto.picture);
      expect(user.status).toBe(dto.status);
    });
  });
});
