import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../../users/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd!', minLength: 8, maxLength: 128, description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({ example: 'Jane', maxLength: 50, description: 'First name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe', maxLength: 50, description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE, description: 'User account status' })
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;
}
