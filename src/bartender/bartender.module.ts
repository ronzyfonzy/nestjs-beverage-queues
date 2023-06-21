import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/constants';
import { BartenderController } from './bartender.controller';
import { BartenderProcessor } from './bartender.processor';

@Module({
  controllers: [BartenderController],
  providers: [BartenderProcessor],
  imports: [
    BullModule.registerQueue(
      {
        name: QUEUES.BARTENDER,
      },
      {
        name: QUEUES.WAITRESS,
      },
    ),
  ],
})
export class BartenderModule {}
