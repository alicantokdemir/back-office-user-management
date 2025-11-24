import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ThingsService } from './things.service';
import { UpsertThingDto } from './dto/upsert-thing.dto';
import { ApiKeyAuth } from '../auth/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PaginationResult } from '../common/pagination';
import { ResponseDto } from '../common/response.dto';
import { ThingProps } from './entities/thing.entity';
import { ListThingDto } from './dto/list-thing.dto';

@Controller('things')
export class ThingsController {
  constructor(private readonly thingsService: ThingsService) {}

  @ApiBearerAuth('api-key-auth')
  @ApiOperation({
    summary: 'Upsert a new Thing',
    description:
      'Creates or updates a Thing with the provided data. Requires API key authentication.',
  })
  @ApiKeyAuth()
  @Post()
  async create(
    @Body() upsertThingDto: UpsertThingDto,
  ): Promise<ResponseDto<ThingProps>> {
    const data = await this.thingsService.create(upsertThingDto);

    return new ResponseDto<ThingProps>({
      data,
      message: 'Thing created successfully',
      success: true,
    });
  }

  @ApiBearerAuth('api-key-auth')
  @ApiOperation({
    summary: 'Get a paginated list of things',
    description:
      'Retrieves a paginated list of things. Requires API key authentication.',
  })
  @ApiKeyAuth()
  @Get()
  async list(
    @Query() listThingDto: ListThingDto,
  ): Promise<ResponseDto<PaginationResult<ThingProps>>> {
    const data = await this.thingsService.list(listThingDto);

    return new ResponseDto<PaginationResult<ThingProps>>({
      data,
      message: 'Things retrieved successfully',
      success: true,
    });
  }

  @ApiBearerAuth('api-key-auth')
  @ApiOperation({
    summary: 'Get a Thing by ID',
    description:
      'Retrieves a specific Thing by its ID. Requires API key authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the Thing to retrieve',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiKeyAuth()
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<ResponseDto<ThingProps>> {
    const data = await this.thingsService.findOneById(id);

    return new ResponseDto<ThingProps>({
      data,
      message: 'Thing retrieved successfully',
      success: true,
    });
  }

  @ApiBearerAuth('api-key-auth')
  @ApiOperation({
    summary: 'Update a Thing by ID',
    description:
      'Updates a specific Thing by its ID with the provided data. Requires API key authentication.',
  })
  @ApiKeyAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() upsertThingDto: UpsertThingDto) {
    return this.thingsService.update(id, upsertThingDto);
  }

  @ApiBearerAuth('api-key-auth')
  @ApiOperation({
    summary: 'Delete a Thing by ID',
    description:
      'Deletes a specific Thing by its ID. Requires API key authentication.',
  })
  @ApiKeyAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thingsService.remove(id);
  }
}
