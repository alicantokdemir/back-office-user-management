import { PrimaryKey, Property } from '@mikro-orm/core';
import { IdType } from '../../../common/base.repository';
import { v4 } from 'uuid';

export abstract class BaseEntity {
  @PrimaryKey({ type: 'string' })
  id: IdType = v4();

  @Property({
    type: 'datetime',
    onCreate: () => new Date(),
    defaultRaw: 'CURRENT_TIMESTAMP',
  })
  createdAt = new Date();

  @Property({ type: 'datetime', onUpdate: () => new Date() })
  updatedAt = new Date();
}
