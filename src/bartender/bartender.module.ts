import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BartenderController } from './bartender.controller';
import { BartenderProcessor } from './bartender.processor';
import { WaiterProcessor } from './waiter.processor';
import { ConfigModule } from '@nestjs/config';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';

import configuration from '../config/configuration';

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
    BullModule.registerQueue({
      name: 'bartender',
    }),
    BullModule.registerQueue({
      name: 'waiter',
    }),
  ],
  controllers: [BartenderController],
  providers: [BartenderProcessor, WaiterProcessor],
})
export class BartenderModule {}
