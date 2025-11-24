import {
  applyDecorators,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyAuthGuard } from './guards/apikey-auth.guard';

export function ApiKeyAuth() {
  return applyDecorators(UseGuards(ApiKeyAuthGuard));
}
