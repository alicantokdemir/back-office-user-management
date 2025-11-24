import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiKeyAuth } from '../auth/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('api-key-auth')
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a user with the provided data.',
  })
  @ApiKeyAuth()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
