import { NestFactory } from '@nestjs/core';
import { BartenderModule } from './bartender/bartender.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(BartenderModule);
  console.debug(`Worker is running`);
}
bootstrap();
