import { ApiProperty } from '@nestjs/swagger';
import {
  IsObject,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isRecordStringAny', async: false })
class IsRecordStringAnyConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }
    return Object.keys(value).every((k) => typeof k === 'string');
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a plain object with string keys`;
  }
}

export class UpsertThingDto {
  @IsObject()
  @Validate(IsRecordStringAnyConstraint)
  @ApiProperty({
    example: {
      metadata: 'SomeId',
      content: '<some_id>',
    },
    description: 'The data of the thing as a JSON object',
  })
  data: Record<string, any>;
}
