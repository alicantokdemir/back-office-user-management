type User = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  loginCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
};
