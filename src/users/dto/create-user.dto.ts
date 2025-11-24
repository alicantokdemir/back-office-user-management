import { UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  status: UserStatus;
}
