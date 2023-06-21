import { Controller, Inject, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Controller('bartender')
export class BartenderController {
  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('bartender') private readonly bartenderQueue: Queue,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return JSON.stringify({ hey: 'hello' });
  }

  @Get('bevarage/:bevarageType')
  async bevarage(@Param('bevarageType') bevarageType: string) {
    await this.bartenderQueue.add(
      'order',
      {
        bevarage: bevarageType,
      },
      {
        removeOnComplete: true,
      },
    );

    return { message: `You just ordered ${bevarageType}` };
  }
}
