import { Migration } from '@mikro-orm/migrations';

export class Migration20251127152115 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`user\` (\`id\` text not null, \`created_at\` datetime not null default CURRENT_TIMESTAMP, \`updated_at\` datetime not null, \`auth_user_id\` text null, \`first_name\` TEXT COLLATE NOCASE not null, \`last_name\` TEXT COLLATE NOCASE not null, \`status\` text check (\`status\` in ('ACTIVE', 'INACTIVE')) not null default 'ACTIVE', \`login_count\` integer not null default 0, constraint \`user_auth_user_id_foreign\` foreign key(\`auth_user_id\`) references \`auth_user\`(\`id\`) on delete set null on update cascade, primary key (\`id\`));`);
    this.addSql(`create unique index \`user_auth_user_id_unique\` on \`user\` (\`auth_user_id\`);`);

    this.addSql(`create table \`session\` (\`id\` text not null, \`created_at\` datetime not null default CURRENT_TIMESTAMP, \`updated_at\` datetime not null, \`user_id\` text not null, \`expires_at\` datetime not null, \`refresh_token_hash\` text not null, \`ip_address\` text not null, \`user_agent\` text not null, constraint \`session_user_id_foreign\` foreign key(\`user_id\`) references \`user\`(\`id\`) on update cascade, primary key (\`id\`));`);
    this.addSql(`create index \`session_user_id_index\` on \`session\` (\`user_id\`);`);

    this.addSql(`create table \`auth_user\` (\`id\` text not null, \`created_at\` datetime not null default CURRENT_TIMESTAMP, \`updated_at\` datetime not null, \`user_id\` text not null, \`email\` TEXT COLLATE NOCASE not null, \`password_hash\` text not null, constraint \`auth_user_user_id_foreign\` foreign key(\`user_id\`) references \`user\`(\`id\`) on update cascade, primary key (\`id\`));`);
    this.addSql(`create unique index \`auth_user_user_id_unique\` on \`auth_user\` (\`user_id\`);`);
    this.addSql(`create unique index \`auth_user_email_unique\` on \`auth_user\` (\`email\`);`);
  }

}
