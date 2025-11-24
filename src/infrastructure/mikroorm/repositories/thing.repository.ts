import { ThingEntity } from '../entities/thing.entity';
import { EntityManager } from '@mikro-orm/sqlite';
import { Thing } from '../../../things/entities/thing.entity';
import { Injectable } from '@nestjs/common';
import { IThingRepository } from '../../../things/things.types';
import { BaseRepository } from './base.repository';

@Injectable()
export class ThingRepository
  extends BaseRepository<ThingEntity, Thing>
  implements IThingRepository
{
  constructor(protected readonly em: EntityManager) {
    super(em, ThingEntity);
  }
}
