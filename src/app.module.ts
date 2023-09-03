import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {
  RequestLoggerMiddleware,
  SessionCookieAccessMiddleware,
  SessionCookieRefreshMiddleware,
} from './common/middlewares';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PgConfig } from './common/configs/database';

// noinspection JSUnresolvedReference
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync(PgConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        exceptionFactory: (validationErrors: ValidationError[]) => {
          return new BadRequestException(
            validationErrors.map((error: ValidationError) => ({
              field: error.property,
              error: Object.values(error.constraints).join(', '),
            })),
          );
        },
      }),
    },
  ],
})
export class AppModule {
  // noinspection JSUnusedGlobalSymbols
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionCookieAccessMiddleware, RequestLoggerMiddleware)
      .exclude('auth/refresh')
      .forRoutes('*');
    consumer.apply(SessionCookieRefreshMiddleware).forRoutes('auth/refresh');
  }
}
