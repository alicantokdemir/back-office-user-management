import { Test, TestingModule } from '@nestjs/testing';
import { ThingsController } from './things.controller';
import { ThingsService } from './things.service';
import { AuthModule } from '../auth/auth.module';
import { ITransactionManager } from '../common/transaction-manager';

describe('ThingsController', () => {
  let controller: ThingsController;
  let mockThingService = {
    generate: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  let mockTransactionManager: ITransactionManager = {
    saveInTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [ThingsController],
      providers: [
        {
          provide: ThingsService,
          useValue: mockThingService,
        },
        {
          provide: ITransactionManager,
          useValue: mockTransactionManager,
        },
      ],
    }).compile();

    controller = module.get<ThingsController>(ThingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
