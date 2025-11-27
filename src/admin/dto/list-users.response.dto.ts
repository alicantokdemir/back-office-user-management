import { UserStatus } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ListUsersResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-uuid', description: 'User identifier' })
  userId: string;

  @ApiProperty({ example: 'Jane', description: 'First name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName: string;

  @ApiProperty({
    example: 'jane.doe@example.com',
    description: 'Email address',
  })
  email: string;

  @ApiProperty({
    example: 5,
    description: 'Number of times the user has logged in',
  })
  loginCount: number;

  @ApiProperty({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: 'Account status',
  })
  status: UserStatus;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Update timestamp',
  })
  updatedAt: Date;
}
