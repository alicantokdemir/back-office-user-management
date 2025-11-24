import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Thing } from '../../../things/entities/thing.entity';

@Entity({ tableName: 'thing' })
export class ThingEntity extends BaseEntity {
  @Property()
  data!: string;

  toObject() {
    const thing = new Thing({
      id: this.id,
      data: this.data,
    });

    return thing;
  }
}
