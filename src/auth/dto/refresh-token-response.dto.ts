import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDto {
  @ApiProperty({ description: 'New JWT access token' })
  accessToken: string;
}
