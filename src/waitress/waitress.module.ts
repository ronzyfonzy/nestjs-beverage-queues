import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/constants';
import { WaitressProcessor } from './waitress.processor';

@Module({
  controllers: [],
  providers: [WaitressProcessor],
  imports: [
    BullModule.registerQueue({
      name: QUEUES.WAITRESS,
    }),
  ],
})
export class WaitressModule {}
