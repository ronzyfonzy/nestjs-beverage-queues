import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PROCESSESS } from 'src/constants';
import { IJobServe } from 'src/interfaces';

@Processor('waitress')
export class WaitressProcessor {
  private readonly logger = new Logger(WaitressProcessor.name);
  private jobId = '';

  @Process(PROCESSESS.SERVE)
  async handleServe(job: Job<IJobServe>) {
    job.progress(0);

    this.jobId = job.data.id;

    const servedBeverage = await this.serveBeverage(job.data.preparedBeverage);

    this.logger.debug(`${this.jobId} / ${servedBeverage} served`);

    job.progress(100);
  }

  async serveBeverage(preparedBeverage: string) {
    this.logger.debug(`${this.jobId} / serving ${preparedBeverage}`);

    const servedBeverage = await new Promise((resolve) =>
      setTimeout(resolve, 5000),
    ).then(() => {
      return preparedBeverage;
    });

    return servedBeverage;
  }
}
