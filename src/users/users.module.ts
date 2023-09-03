import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import {
  UsersRepositoriesImpl,
  USERS_REPOSITORIES,
} from './users.repositories';
import { AUTH_REPOSITORIES, AuthRepositoriesImpl } from './auth.repositories';
import { USERS_SERVICES, UsersServiceImpl } from './users.service';
import {
  TOKEN_MANAGER_SERVICES,
  TokenManagerServicesImpl,
} from './token-manager.service';
import { AUTH_SERVICES, AuthServicesImpl } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '../common/guards';

@Module({
  controllers: [AuthController],
  imports: [ConfigModule, JwtModule.register({})],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    { provide: USERS_REPOSITORIES, useClass: UsersRepositoriesImpl },
    { provide: AUTH_REPOSITORIES, useClass: AuthRepositoriesImpl },
    { provide: USERS_SERVICES, useClass: UsersServiceImpl },
    { provide: TOKEN_MANAGER_SERVICES, useClass: TokenManagerServicesImpl },
    { provide: AUTH_SERVICES, useClass: AuthServicesImpl },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class UsersModule {}
