import { Test, TestingModule } from '@nestjs/testing';
import { ThingsService } from './things.service';
import { IThingRepository } from './things.types';
import { ITransactionManager } from '../common/transaction-manager';

describe('ThingsService', () => {
  let service: ThingsService;
  let mockThingRepository: IThingRepository = {
    create: jest.fn(),
    findAllPaginated: jest.fn(),
    findAllUnpaginated: jest.fn(),
    findOne: jest.fn(),
    findOneById: jest.fn(),
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
        ThingsService,
        {
          provide: IThingRepository,
          useValue: mockThingRepository,
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

    service = module.get<ThingsService>(ThingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
