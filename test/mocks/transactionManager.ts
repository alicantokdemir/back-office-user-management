import { ITransactionManager } from '../../src/common/transaction-manager';

export const mockTransactionManager: ITransactionManager = {
  saveInTransaction: jest.fn(),
};

(mockTransactionManager.saveInTransaction as jest.Mock).mockImplementation(
  async (cb: any) => cb(),
);
