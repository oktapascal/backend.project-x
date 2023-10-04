import { USERS_SERVICES, UsersServiceImpl } from './users.service';
import { TOKEN_MANAGER_SERVICES, TokenManagerServicesImpl } from './token-manager.service';
import { AUTH_REPOSITORIES, AuthRepositoriesImpl } from './auth.repositories';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersRepositoriesImpl, USERS_REPOSITORIES } from './users.repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlLiteDatasource } from '../test-utils/SqlLiteTestingModule';
import { AUTH_SERVICES, AuthServicesImpl } from './auth.service';
import { CreateUserRequest, RefreshTokenRequest, SigninRequest } from './requests';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfig } from '../common/configs/database';

describe.skip('AuthService', () => {
  let authService: AuthServicesImpl;
  let usersService: UsersServiceImpl;
  let tokenmanagerService: TokenManagerServicesImpl;
  let authRepo: AuthRepositoriesImpl;
  let userRepo: UsersRepositoriesImpl;
  let request: CreateUserRequest;
  let user_id: string;
  let refresh_token: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(SqlLiteDatasource),
        JwtModule.register({}),
        ConfigModule.forRoot({
          envFilePath: '.env.dev',
        }),
        CacheModule.registerAsync(RedisConfig),
      ],
      providers: [
        {
          provide: TOKEN_MANAGER_SERVICES,
          useClass: TokenManagerServicesImpl,
        },
        {
          provide: AUTH_SERVICES,
          useClass: AuthServicesImpl,
        },
        {
          provide: USERS_SERVICES,
          useClass: UsersServiceImpl,
        },
        {
          provide: AUTH_REPOSITORIES,
          useClass: AuthRepositoriesImpl,
        },
        {
          provide: USERS_REPOSITORIES,
          useClass: UsersRepositoriesImpl,
        },
      ],
    }).compile();

    authService = module.get<AuthServicesImpl>(AUTH_SERVICES);
    usersService = module.get<UsersServiceImpl>(USERS_SERVICES);
    tokenmanagerService = module.get<TokenManagerServicesImpl>(TOKEN_MANAGER_SERVICES);
    authRepo = module.get<AuthRepositoriesImpl>(AUTH_REPOSITORIES);
    userRepo = module.get<UsersRepositoriesImpl>(USERS_REPOSITORIES);

    request = new CreateUserRequest();
    request.username = 'foo';
    request.password = 'bar';
    request.full_name = 'foo bar';
    request.role = 'USER';

    const result = await usersService.SaveUser(request);
    user_id = result.user_id;
  });

  it('auth repositories should be defined', () => {
    expect(authRepo).toBeDefined();
  });

  it('user repositories should be defined', () => {
    expect(userRepo).toBeDefined();
  });

  it('auth services should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('user services should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('token manager services should be defined', () => {
    expect(tokenmanagerService).toBeDefined();
  });

  describe('GetCredentialData', () => {
    it('should get data user by his credential', async () => {
      const repospy = jest.spyOn(userRepo, 'GetUserById');

      const result = await authService.GetCredentialData(user_id);

      expect(result.user_id).toBe(user_id);
      expect(repospy).toBeCalledWith(user_id);
    });
  });

  describe('Success SignIn', () => {
    const request = new SigninRequest();
    request.username = 'foo';
    request.password = 'bar';
    request.ip_address = 'localhost';
    request.user_agent = 'testing';

    it('should generate access & refresh token', async () => {
      const result = await authService.SignIn(request);

      refresh_token = result.refresh_token;

      expect(result.refresh_token.length).toBeGreaterThan(1);
    });
  });

  describe('Failed SignIn because wrong username', () => {
    const request = new SigninRequest();
    request.username = 'bar';
    request.password = 'foo';
    request.ip_address = 'localhost';
    request.user_agent = 'testing';

    it('should failed because wrong username', async () => {
      await expect(authService.SignIn(request)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Failed SignIn because wrong password', () => {
    const request = new SigninRequest();
    request.username = 'foo';
    request.password = 'foo';
    request.ip_address = 'localhost';
    request.user_agent = 'testing';

    it('should failed because wrong password', async () => {
      await expect(authService.SignIn(request)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('UpdateRefreshToken', () => {
    it('should update refresh token', async () => {
      const repospy = jest.spyOn(authRepo, 'SaveRefreshToken');

      const request = new RefreshTokenRequest();
      request.user_id = 'USR.00001';
      request.token = refresh_token;

      await authService.RefreshToken(request);

      expect(repospy).toHaveBeenCalled();
    });
  });

  describe('SignOut', () => {
    it('should sign out and update refresh token', async () => {
      const repospy = jest.spyOn(authRepo, 'DeleteRefreshToken');

      await authService.SignOut(user_id);

      expect(repospy).toBeCalledWith(user_id);
    });
  });
});
