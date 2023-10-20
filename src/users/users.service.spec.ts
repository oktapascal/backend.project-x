import { Test, TestingModule } from '@nestjs/testing';
import { USERS_SERVICES, UsersServiceImpl } from './users.service';
import { UsersRepositoriesImpl, USERS_REPOSITORIES } from './users.repositories';
import { SqlLiteDatasource } from '../test-utils/SqlLiteTestingModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserRequest } from './requests';
import { ROLES_REPOSITORIES, RolesRepositoriesImpl } from './roles.repositories';
import { RolesDto } from './dto';

describe('UsersService', () => {
  let serviceUser: UsersServiceImpl;
  let repoUser: UsersRepositoriesImpl;
  let repoRole: RolesRepositoriesImpl;
  let requestCreateUser: CreateUserRequest;
  let dtoRole: RolesDto;
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
        {
          provide: ROLES_REPOSITORIES,
          useClass: RolesRepositoriesImpl,
        },
      ],
    }).compile();

    serviceUser = module.get<UsersServiceImpl>(USERS_SERVICES);
    repoUser = module.get<UsersRepositoriesImpl>(USERS_REPOSITORIES);
    repoRole = module.get<RolesRepositoriesImpl>(ROLES_REPOSITORIES);

    dtoRole = new RolesDto();
    dtoRole.role_id = 'ROL.001';
    dtoRole.name = 'Test role';
    dtoRole.flag_read = true;
    dtoRole.flag_insert = true;
    dtoRole.flag_update = true;
    dtoRole.flag_delete = true;

    await repoRole.Save(dtoRole);

    requestCreateUser = new CreateUserRequest();
    requestCreateUser.username = 'foo';
    requestCreateUser.password = 'bar';
    requestCreateUser.full_name = 'foo bar';
    requestCreateUser.role = 'ROL.001';
  });

  it('UserRepositories should be defined', () => {
    expect(repoUser).toBeDefined();
  });

  it('UsersService should be defined', () => {
    expect(serviceUser).toBeDefined();
  });

  describe('SaveUser', () => {
    it('should success save user data', async () => {
      const repospy = jest.spyOn(repoUser, 'CreateUser');

      const result = await serviceUser.SaveUser(requestCreateUser);
      user_id = result.user_id;

      expect(result.username).toBe(requestCreateUser.username);
      expect(repospy).toHaveBeenCalled();
    });
  });

  describe('GetOneByUsername', () => {
    it('should get user by username', async () => {
      const repospy = jest.spyOn(repoUser, 'GetUserByUsername');

      const result = await serviceUser.GetUserByUsername(requestCreateUser.username);

      expect(result.username).toEqual(requestCreateUser.username);
      expect(repospy).toBeCalledWith(requestCreateUser.username);
    });

    it('should not get user because wrong username', () => {
      const repospy = jest.spyOn(repoUser, 'GetUserByUsername');

      expect(serviceUser.GetUserByUsername('bar')).resolves.toBe(null);
      expect(repospy).toBeCalledWith('bar');
    });
  });

  describe('GetOneById', () => {
    it('should get user by id', async () => {
      const repospy = jest.spyOn(repoUser, 'GetUserById');

      const result = await serviceUser.GetUserById(user_id);

      expect(result.user_id).toEqual(user_id);
      expect(repospy).toBeCalledWith(user_id);
    });

    it('should not found user', () => {
      const repospy = jest.spyOn(repoUser, 'GetUserById');

      expect(serviceUser.GetUserById('usr-002')).resolves.toBe(null);
      expect(repospy).toBeCalledWith('usr-002');
    });
  });
});
