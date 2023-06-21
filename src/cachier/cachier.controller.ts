import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { QUEUES } from 'src/constants';
import { randomUUID } from 'crypto';
import { IJobOrder } from 'src/interfaces';

@Controller('cachier')
export class CachierController {
  constructor(
    @InjectQueue(QUEUES.BARTENDER) private readonly bartenderQueue: Queue,
  ) {}

  @Get()
  async getHello(@Res() res: Response) {
    res.json({ hey: `hello I'm a friendly cachier` });
  }

  @Get('order/:beverage')
  async order(@Param('beverage') beverage: string, @Res() res: Response) {
    const jobData: IJobOrder = {
      id: randomUUID(),
      beverage,
    };

    await this.bartenderQueue.add('order', jobData);

    res.json({ message: `(˵ ͡° ͜ʖ ͡°˵) You just ordered ${beverage}`, jobData });
  }
}
