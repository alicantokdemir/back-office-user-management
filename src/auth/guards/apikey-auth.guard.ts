import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const expectedApiKey = process.env.API_KEY;

    if (!apiKey || apiKey !== expectedApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
