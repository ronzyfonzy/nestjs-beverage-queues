import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';

import configuration from './config/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BartenderController } from './bartender/bartender.controller';

import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      /** @see https://github.com/dabroek/node-cache-manager-redis-store/issues/53#issuecomment-1372944703 */
      store: redisStore as unknown as CacheStore,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'bartender',
      },
      {
        name: 'waiter',
      },
    ),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature(
      {
        name: 'bartender',
        adapter: BullAdapter,
      },
      {
        name: 'waiter',
        adapter: BullAdapter,
      },
    ),
  ],
  controllers: [AppController, BartenderController],
  providers: [AppService],
})
export class AppModule {}
