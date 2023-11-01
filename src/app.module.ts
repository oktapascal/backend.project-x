import { BadRequestException, MiddlewareConsumer, Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { RequestLoggerMiddleware } from './common/middlewares';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './UsersManager/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PgConfig } from './common/configs/database';
import { ModulesModule } from './ModulesManager/modules.module';
import { errorConverter } from './common/helpers';

// noinspection JSUnresolvedReference
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync(PgConfig),
    UsersModule,
    ModulesModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        exceptionFactory: (validationErrors: ValidationError[]) => {
          const errors = errorConverter(validationErrors);
          return new BadRequestException([errors]);
        },
      }),
    },
  ],
})
export class AppModule {
  // noinspection JSUnusedGlobalSymbols
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).exclude('auth/refresh').forRoutes('*');
  }
}
