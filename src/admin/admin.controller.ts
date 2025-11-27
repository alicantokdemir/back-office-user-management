import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ResponseDto } from '../common/response.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';

import {
  ACCESS_TOKEN_COOKIE_AGE,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_AGE,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../common/constants';
import { AdminService } from './admin.service';
import { ListUsersResponseDto } from './dto/list-users.response.dto';
import { ListUserDto } from './dto/list-user.dto';
import { PaginationResult } from '../common/pagination';
import { JwtAuth } from '../auth/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { create } from 'domain';

@ApiTags('admin')
@ApiExtraModels(ResponseDto, LoginResponseDto, RefreshTokenResponseDto)
@ApiBearerAuth('jwt-auth')
@JwtAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'List users',
    description: 'Lists all users in the system.',
  })
  @ApiOkResponse({
    description: 'List users successful',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ListUsersResponseDto) },
            },
          },
        },
      ],
    },
  })
  @ApiOperation({
    summary: 'Get a paginated list of users',
    description: 'Retrieves a paginated list of users.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials or inactive user',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Get('list-users')
  async listUsers(
    @Query() listUserDto: ListUserDto,
  ): Promise<ResponseDto<PaginationResult<ListUsersResponseDto>>> {
    const data = await this.adminService.listUsers(listUserDto);

    return new ResponseDto<PaginationResult<ListUsersResponseDto>>({
      data,
      message: 'Users retrieved successfully',
      success: true,
    });
  }

  @ApiOperation({
    summary: 'Delete a User by ID',
    description: 'Deletes a specific User by its ID.',
  })
  @Delete('remove-user/:id')
  removeUser(@Param('id') id: string) {
    return this.adminService.deleteUserById(id);
  }

  @ApiOperation({
    summary: 'Update a User by ID',
    description: 'Updates a specific user by its ID with the provided data.',
  })
  @Patch('update-user/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a user with the provided data.',
  })
  @Post('create-user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }
}
