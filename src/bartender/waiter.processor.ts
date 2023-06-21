import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Processor('waiter')
export class WaiterProcessor {
  private readonly myNameIs = 'Waiter';
  private readonly logger = new Logger(WaiterProcessor.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Process('serve')
  async handleOrder(job: Job) {
    this.logger.debug(`${this.myNameIs} serving bevarage ${job.data.id}...`);
    job.progress(0);

    const serve = await new Promise((resolve) =>
      setTimeout(resolve, 8000),
    ).then(() => {
      return job.data;
    });

    this.logger.debug(`${this.myNameIs} served ${serve.bevarage}`);

    job.progress(100);

    this.logger.debug(`${this.myNameIs} free \\o/`);
  }
}
