import { Controller, Get, Inject, Param } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { BullBoardInstance, InjectBullBoard } from '@bull-board/nestjs';

import { v4 as uuidv4 } from 'uuid';

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('bartender') private readonly bartenderQueue: Queue,
    @InjectBullBoard() private readonly boardInstance: BullBoardInstance,
  ) {}

  @Get()
  getFeature() {
    // You can do anything from here with the boardInstance for example:

    //this.boardInstance.replaceQueues();
    // this.boardInstance.addQueue({});
    //this.boardInstance.setQueues();

    return 'ok';
  }

  @Get('status')
  async status() {
    return {
      numberOfBartenders: this.configService.get<number>('numberOfBartenders'),
    };
  }

  @Get()
  async getHello(): Promise<string> {
    let counter = (await this.cacheManager.get<number>('counter')) || 0;
    await this.cacheManager.set('counter', ++counter);
    return JSON.stringify({ counter });
  }

  @Get('bevarage/:bevarageType')
  async bevarage(@Param('bevarageType') bevarageType: string) {
    await this.bartenderQueue.add('order', {
      id: uuidv4(),
      bevarage: bevarageType,
    });

    return { message: `You just ordered ${bevarageType}` };
  }
}
