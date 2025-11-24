export const mockBaseRepository = {
  create: jest.fn().mockImplementation(async (entity: any) => {
    return { ...entity, id: 'mock-id' };
  }),
  findAllPaginated: jest.fn(),
  findAllUnpaginated: jest.fn(),
  findOneById: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn().mockImplementation(async (id: any, updateObj: any) => {
    return { ...updateObj, id };
  }),
  remove: jest.fn(),
  count: jest.fn(),
};
