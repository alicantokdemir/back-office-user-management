import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseDto<T = any> {
  @ApiProperty({
    example: true,
    description: 'Indicates if the operation was successful',
  })
  success: boolean;

  @ApiPropertyOptional({
    example: 'Operation completed',
    description: 'Optional message',
  })
  message?: string;

  @ApiPropertyOptional({
    type: Object,
    nullable: true,
    description: 'Optional payload (schema varies by endpoint)',
  })
  data?: T;

  constructor(params: { data?: T; message?: string; success?: boolean }) {
    this.data = params.data;
    this.message = params.message;
    this.success = params.success ?? true;
  }
}
