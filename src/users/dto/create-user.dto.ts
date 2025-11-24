import { UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  picture?: string;
  status: UserStatus;
}
