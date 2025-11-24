import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 10;
export const MAX_ITEMS_PER_PAGE = 100;

export const DEFAULT_SORT_BY = 'createdAt';
export const DEFAULT_SORT_ORDER: 'ASC' | 'DESC' = 'ASC';

export type PaginationProps<T> = {
  items: T[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
};

export class PaginationDto {
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: DEFAULT_PAGE,
    description: 'The page number to retrieve (starting from 1)',
    default: DEFAULT_PAGE,
  })
  page: number;

  @IsNumber()
  @Min(1)
  @Max(MAX_ITEMS_PER_PAGE)
  @ApiProperty({
    example: DEFAULT_ITEMS_PER_PAGE,
    description: `Number of items per page (max ${MAX_ITEMS_PER_PAGE})`,
    default: DEFAULT_ITEMS_PER_PAGE,
  })
  itemsPerPage: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: DEFAULT_SORT_BY,
    description: 'Field to sort by',
    required: false,
  })
  sortBy: string = DEFAULT_SORT_BY;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  @ApiProperty({
    example: DEFAULT_SORT_ORDER,
    description: 'Sort order (ASC or DESC)',
    required: false,
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  sortOrder: 'ASC' | 'DESC' = DEFAULT_SORT_ORDER;
}

export class PaginationResult<T> {
  readonly items: T[];
  readonly totalItems: number;
  readonly totalPages: number;
  readonly currentPage: number;
  readonly sortBy: string;
  readonly sortOrder: 'ASC' | 'DESC';

  constructor(props: PaginationProps<T>) {
    Object.assign(this, props);
  }
}
