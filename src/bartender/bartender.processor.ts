import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { randomUUID } from 'crypto';
import { PROCESSESS, QUEUES } from 'src/constants';
import { IJobOrder, IJobServe } from 'src/interfaces';

@Processor('bartender')
export class BartenderProcessor {
  private readonly logger = new Logger(BartenderProcessor.name);
  private readonly isAlsoServing = false;
  private jobId = '';

  constructor(
    @InjectQueue(QUEUES.WAITRESS) private readonly waitressQueue: Queue,
  ) {}

  @Process(PROCESSESS.ORDER)
  async handleOrder(job: Job<IJobOrder>) {
    job.progress(0);
    // job.log('put this into job logs');

    this.jobId = job.data.id;

    const preparedBeverage = await this.preparedBeverage(job.data.beverage);
    this.logger.debug(`${this.jobId} / ${preparedBeverage} prepared`);

    job.progress(50);

    if (this.isAlsoServing) {
      const servedBeverage = await this.serveBeverage(preparedBeverage);
      this.logger.debug(`${this.jobId} / ${servedBeverage} served ※\\(^o^)/※`);
    } else {
      await this.handOverToWaitress(preparedBeverage);
    }

    job.progress(100);
  }

  async preparedBeverage(beverage: string) {
    this.logger.debug(`${this.jobId} / preparing ${beverage}`);

    const preparedBeverage = await new Promise((resolve) =>
      setTimeout(resolve, 5000),
    ).then(() => {
      return beverage;
    });

    return preparedBeverage;
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

  async handOverToWaitress(preparedBeverage: string) {
    this.logger.debug(`${this.jobId} / hand over to waitress`);

    const jobData: IJobServe = {
      id: randomUUID(),
      preparedBeverage,
    };

    return this.waitressQueue.add(PROCESSESS.SERVE, jobData);
  }
}
