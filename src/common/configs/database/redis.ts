import { CacheModuleAsyncOptions, CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

export const RedisConfig: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<CacheModuleOptions> => ({
    store: redisStore,
    host: config.get('REDIS_HOST'),
    port: config.get('REDIS_PORT'),
    password: config.get('REDIS_PASSWORD'),
  }),
};
