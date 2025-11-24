import { Options, SqliteDriver } from '@mikro-orm/sqlite';
import { Migrator } from '@mikro-orm/migrations';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';

const mikroOrmConfig: Options = {
  entities: ['./dist/infrastructure/mikroorm/entities'],
  entitiesTs: ['./src/infrastructure/mikroorm/entities'],
  dbName: 'example.sqlite3',
  driver: SqliteDriver,
  extensions: [Migrator, EntityGenerator, SeedManager],
};

export default mikroOrmConfig;
