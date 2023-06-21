import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Processor('bartender')
export class BartenderProcessor {
  private readonly myNameIs = 'Bartender';
  private readonly logger = new Logger(BartenderProcessor.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('waiter') private readonly waiterQueue: Queue,
  ) {}

  @Process('order')
  async handleOrder(job: Job) {
    this.logger.debug(`${this.myNameIs} preparing bevarage ${job.data.id}...`);
    job.log('asd');
    job.progress(0);

    const prepared = await new Promise((resolve) =>
      setTimeout(resolve, 5000),
    ).then(() => {
      return job.data;
    });
    this.logger.debug(`${this.myNameIs} prepared ${prepared.bevarage}`);
    // this.logger.debug(`${this.myNameIs} serving ${prepared.bevarage}...`);

    this.logger.debug(`${this.myNameIs} moving to waiter`);
    await this.waiterQueue.add('serve', job.data);
    // job.progress(30);

    // const serve = await new Promise((resolve) =>
    //   setTimeout(resolve, 5000),
    // ).then(() => {
    //   return prepared;
    // });

    // this.logger.debug(`${this.myNameIs} served ${serve.bevarage}`);

    // let counter = (await this.cacheManager.get<number>('counter')) || 0;
    // if (counter > 0) {
    //   await this.cacheManager.set('counter', --counter);
    // }
    job.progress(100);

    this.logger.debug(`${this.myNameIs} free \\o/`);
  }
}
