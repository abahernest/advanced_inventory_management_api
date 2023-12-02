import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  app.setGlobalPrefix('api');

  app.use(helmet());
  app.enableCors();

  // enable DI for class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
