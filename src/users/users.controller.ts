import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiKeyAuth } from '../auth/auth.decorator';
import { ListUserDto } from './dto/list-user.dto';
import { ResponseDto } from '../common/response.dto';
import { PaginationResult } from '../common/pagination';
import { UserProps } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @ApiBearerAuth('api-key-auth')
  @ApiOperation({
    summary: 'Get a paginated list of users',
    description:
      'Retrieves a paginated list of users. Requires API key authentication.',
  })
  @ApiKeyAuth()
  @Get()
  async list(
    @Query() listUserDto: ListUserDto,
  ): Promise<ResponseDto<PaginationResult<UserProps>>> {
    const data = await this.usersService.list(listUserDto);

    return new ResponseDto<PaginationResult<UserProps>>({
      data,
      message: 'Users retrieved successfully',
      success: true,
    });
  }

  @ApiBearerAuth('api-key-auth')
  @ApiOperation({
    summary: 'Update a User by ID',
    description:
      'Updates a specific user by its ID with the provided data. Requires API key authentication.',
  })
  @ApiKeyAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
