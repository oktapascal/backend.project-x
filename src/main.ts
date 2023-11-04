import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import * as CookieParser from 'cookie-parser';
import 'winston-daily-rotate-file';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        // for logs error
        new transports.DailyRotateFile({
          filename: `logs/%DATE%_error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        // for logs all level
        new transports.DailyRotateFile({
          filename: `logs/%DATE%_combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        // show logs in console
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `[${info.timestamp}] [${info.level}]: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });

  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['POST', 'GET', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Request-Time', 'Accept', 'Content-Type', 'Authorization', 'X-No-Retry'],
    credentials: true,
  });

  app.use(CookieParser());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder().setTitle('Project-X API').setDescription('API Project-X').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
// noinspection JSIgnoredPromiseFromCall
bootstrap();
