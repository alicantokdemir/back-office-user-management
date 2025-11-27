import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserStatus } from '../../users/entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  email?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  status?: UserStatus;
}
