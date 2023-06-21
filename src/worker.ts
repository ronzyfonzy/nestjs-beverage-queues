import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BartenderModule } from './bartender/bartender.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(BartenderModule);
  process.env.WORKER_HTTP_PORT = process.env.WORKER_HTTP_PORT ?? '4001';
  console.debug(`Worker is running`);
}
bootstrap();
