import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiKeyAuthGuard } from './guards/apikey-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

export function ApiKeyAuth() {
  return applyDecorators(UseGuards(ApiKeyAuthGuard));
}

export function JwtAuth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
