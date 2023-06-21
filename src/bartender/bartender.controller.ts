import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('bartender')
export class BartenderController {
  @Get()
  async getHello(@Res() res: Response) {
    res.json({ hey: `I'm a funky bartender ԅ(≖‿≖ԅ)` });
  }

  @Get('order/:beverage')
  async order(@Param('beverage') beverage: string) {
    const preparedBeverage = await new Promise((resolve) =>
      setTimeout(resolve, 5000),
    ).then(() => {
      return beverage;
    });

    return {
      message: `(˵ ͡° ͜ʖ ͡°˵) You just ordered ${beverage}`,
      hereIsYour: preparedBeverage,
    };
  }
}
