import { Test, TestingModule } from '@nestjs/testing';
import { TOKEN_MANAGER_SERVICES, TokenManagerServicesImpl } from './token-manager.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

describe('TokenManagerServices', () => {
  let service: TokenManagerServicesImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({}),
        ConfigModule.forRoot({
          envFilePath: '.env.dev',
        }),
      ],
      providers: [
        {
          provide: TOKEN_MANAGER_SERVICES,
          useClass: TokenManagerServicesImpl,
        },
      ],
    }).compile();

    service = module.get<TokenManagerServicesImpl>(TOKEN_MANAGER_SERVICES);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('NewAccessToken', () => {
    it('success generate jwt access token', async () => {
      const token = await service.NewAccessToken('secret');

      expect(token.length).toBeGreaterThan(10);
    });
  });

  describe('NewRefreshToken', () => {
    it('success generate jwt refresh token', async () => {
      const token = await service.NewRefreshToken('secret');

      expect(token.length).toBeGreaterThan(10);
    });
  });
});
