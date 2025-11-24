import { Migration } from '@mikro-orm/migrations';

export class Migration20251107233352 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`thing\` (\`id\` text not null, \`created_at\` datetime not null default CURRENT_TIMESTAMP, \`updated_at\` datetime not null, \`data\` text not null, primary key (\`id\`));`);

    this.addSql(`create table \`user\` (\`id\` text not null, \`created_at\` datetime not null default CURRENT_TIMESTAMP, \`updated_at\` datetime not null, \`provider\` text not null, \`provider_id\` text not null, \`email\` text not null, \`status\` text check (\`status\` in ('ACTIVE', 'BLOCKED', 'PENDING_VERIFICATION', 'DELETED')) not null default 'ACTIVE', \`name\` text null, \`picture\` text null, primary key (\`id\`));`);
  }

}
