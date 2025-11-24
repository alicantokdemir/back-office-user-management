import { User, UserStatus } from '../../src/users/entities/user.entity';

function mockUserGenerator(): User {
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Miller'];
  const statuses = Object.values(UserStatus);

  const getRandomElement = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  return {
    firstName: getRandomElement(firstNames),
    lastName: getRandomElement(lastNames),
    status: getRandomElement(statuses) as UserStatus,
    loginCount: Math.floor(Math.random() * 100),
  };
}

const mockUsers: User[] = Array.from({ length: 10 }, () => mockUserGenerator());

export { mockUsers };
