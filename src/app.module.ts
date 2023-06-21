import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';

import { QUEUES } from './constants';

import { AppController } from './app.controller';
import { BartenderController } from './bartender/bartender.controller';
import { BartenderModule } from './bartender/bartender.module';
import { CachierController } from './cachier/cachier.controller';
import { WaitressModule } from './waitress/waitress.module';

@Module({
  controllers: [AppController, BartenderController, CachierController],
  providers: [],
  imports: [
    BartenderModule,
    WaitressModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: QUEUES.BARTENDER,
      },
      {
        name: QUEUES.WAITRESS,
      },
    ),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature(
      {
        name: QUEUES.BARTENDER,
        adapter: BullAdapter,
      },
      {
        name: QUEUES.WAITRESS,
        adapter: BullAdapter,
      },
    ),
  ],
})
export class AppModule {}
