import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  async getHello(@Res() res: Response) {
    res.json({ welcome: `To SkillUp bar ¯\\_(ツ)_/¯ c[_]` });
  }
}
