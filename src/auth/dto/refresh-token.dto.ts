import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiPropertyOptional({ 
    description: 'Refresh token (required for mobile clients, optional for web as it uses cookies)' 
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
