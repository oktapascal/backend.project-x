import { BadRequestException, MiddlewareConsumer, Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { RequestLoggerMiddleware } from './common/middlewares';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PgConfig, RedisConfig } from './common/configs/database';
import { ModulesModule } from './modules/modules.module';
import { errorConverter } from './common/helpers';
import { CacheModule } from '@nestjs/cache-manager';

// noinspection JSUnresolvedReference
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync(PgConfig),
    CacheModule.registerAsync(RedisConfig),
    UsersModule,
    ModulesModule,
  ],
  controllers: [],
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
