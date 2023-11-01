import { Test, TestingModule } from '@nestjs/testing';
import { MODULES_ROLE_REPOSITORIES, ModulesRoleRepositoriesImpl } from '../reposiories/modules-role.repositories';
import { MODULES_ROLE_SERVICES, ModulesRoleServiceImpl } from './modules-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlLiteDatasource } from '../../test-utils/SqlLiteTestingModule';
import { CreateModuleRoleRequest } from '../request';

describe('ModulesRoleService', () => {
  let repo: ModulesRoleRepositoriesImpl;
  let service: ModulesRoleServiceImpl;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRootAsync(SqlLiteDatasource)],
      providers: [
        {
          provide: MODULES_ROLE_REPOSITORIES,
          useClass: ModulesRoleRepositoriesImpl,
        },
        {
          provide: MODULES_ROLE_SERVICES,
          useClass: ModulesRoleServiceImpl,
        },
      ],
    }).compile();

    repo = module.get<ModulesRoleRepositoriesImpl>(MODULES_ROLE_REPOSITORIES);
    service = module.get<ModulesRoleServiceImpl>(MODULES_ROLE_SERVICES);
  });

  it('modules role repositories should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('modules role services should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SaveModulesRole', () => {
    const request = new CreateModuleRoleRequest();
    request.role_id = 'ROL.001';
    request.modules = [
      {
        module_id: 'MDL.001',
        status_active: true,
      },
      {
        module_id: 'MDL.002',
        status_active: true,
      },
      {
        module_id: 'MDL.003',
        status_active: true,
      },
    ];

    it('should save modules role data', async () => {
      const repospy = jest.spyOn(repo, 'Save');

      await service.SaveModulesRole(request);

      expect(repospy).toHaveBeenCalled();
    });
  });
});
