import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ITransactionManager } from './transaction-manager';
import { MikroOrmTransactionManager } from '../infrastructure/mikroorm/mikroorm-transaction-manager';
import mikroOrmConfig from '../infrastructure/mikroorm/mikroorm.config';

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig)],
  controllers: [],
  providers: [
    {
      provide: ITransactionManager,
      useClass: MikroOrmTransactionManager,
    },
  ],
  exports: [ITransactionManager],
})
export class CommonModule {}
