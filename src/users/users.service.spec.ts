import { Test, TestingModule } from '@nestjs/testing';
import { USERS_SERVICES, UsersServiceImpl } from './users.service';
import { UsersRepositoriesImpl, USERS_REPOSITORIES } from './users.repositories';
import { SqlLiteDatasource } from '../test-utils/SqlLiteTestingModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserRequest } from './requests';

describe('UsersService', () => {
  let service: UsersServiceImpl;
  let repo: UsersRepositoriesImpl;
  let request: CreateUserRequest;
  let user_id: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRootAsync(SqlLiteDatasource)],
      providers: [
        {
          provide: USERS_SERVICES,
          useClass: UsersServiceImpl,
        },
        {
          provide: USERS_REPOSITORIES,
          useClass: UsersRepositoriesImpl,
        },
      ],
    }).compile();

    service = module.get<UsersServiceImpl>(USERS_SERVICES);
    repo = module.get<UsersRepositoriesImpl>(USERS_REPOSITORIES);

    request = new CreateUserRequest();
    request.username = 'foo';
    request.password = 'bar';
    request.full_name = 'foo bar';
    request.role = 'USER';
  });

  it('repositories should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SaveUser', () => {
    it('should success save user data', async () => {
      const repospy = jest.spyOn(repo, 'CreateUser');

      const result = await service.SaveUser(request);
      user_id = result.user_id;

      expect(result.username).toBe(request.username);
      expect(repospy).toHaveBeenCalled();
    });
  });

  describe('GetOneByUsername', () => {
    it('should get user by username', async () => {
      const repospy = jest.spyOn(repo, 'GetUserByUsername');

      const result = await service.GetUserByUsername(request.username);

      expect(result.username).toEqual(request.username);
      expect(repospy).toBeCalledWith(request.username);
    });

    it('should not get user because wrong username', () => {
      const repospy = jest.spyOn(repo, 'GetUserByUsername');

      expect(service.GetUserByUsername('bar')).resolves.toBe(null);
      expect(repospy).toBeCalledWith('bar');
    });
  });

  describe('GetOneById', () => {
    it('should get user by id', async () => {
      const repospy = jest.spyOn(repo, 'GetUserById');

      const result = await service.GetUserById(user_id);

      expect(result.user_id).toEqual(user_id);
      expect(repospy).toBeCalledWith(user_id);
    });

    it('should not found user', () => {
      const repospy = jest.spyOn(repo, 'GetUserById');

      expect(service.GetUserById('usr-002')).resolves.toBe(null);
      expect(repospy).toBeCalledWith('usr-002');
    });
  });
});
