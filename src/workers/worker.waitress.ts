import { NestFactory } from '@nestjs/core';
import { WaitressModule } from '../waitress/waitress.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(WaitressModule);
  console.debug(`Worker is running`);
}
bootstrap();
