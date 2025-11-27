import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class LoginSessionDto {
  @ApiProperty({ example: 'session-uuid', description: 'Session identifier' })
  id: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Session expiration time',
  })
  expiresAt: Date;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token (only for mobile clients)' })
  accessToken?: string;

  @ApiPropertyOptional({
    description: 'JWT refresh token (only for mobile clients)',
  })
  refreshToken?: string;

  @ApiProperty({ type: () => LoginSessionDto, description: 'Session details' })
  session: {
    id: string;
    expiresAt: Date;
  };
}
