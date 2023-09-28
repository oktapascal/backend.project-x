import { Test, TestingModule } from '@nestjs/testing';
import { MODULES_SERVICES, ModulesServicesImpl } from './modules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlLiteDatasource } from '../test-utils/SqlLiteTestingModule';
import { MODULES_REPOSITORIES, ModulesRepositoriesImpl } from './modules.repositories';
import { CreateModuleRequest, UpdateModuleRequest } from './request';
import { NotFoundException } from '@nestjs/common';

describe.skip('ModulesService', () => {
  let moduleRepo: ModulesRepositoriesImpl;
  let moduleService: ModulesServicesImpl;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRootAsync(SqlLiteDatasource)],
      providers: [
        {
          provide: MODULES_REPOSITORIES,
          useClass: ModulesRepositoriesImpl,
        },
        {
          provide: MODULES_SERVICES,
          useClass: ModulesServicesImpl,
        },
      ],
    }).compile();

    moduleRepo = module.get<ModulesRepositoriesImpl>(MODULES_REPOSITORIES);
    moduleService = module.get<ModulesServicesImpl>(MODULES_SERVICES);
  });

  it('module repositories should be defined', () => {
    expect(moduleRepo).toBeDefined();
  });

  it('module services should be defined', () => {
    expect(moduleService).toBeDefined();
  });

  describe('SaveModule', () => {
    const request = new CreateModuleRequest();
    request.name = 'Testing module';
    request.icon = 'icon';

    it('should save module data', async () => {
      const result = await moduleService.SaveModule(request);

      expect(result.name).toEqual('Testing module');
    });
  });

  describe('UpdateModule', () => {
    it('should update module data', async () => {
      const request = new UpdateModuleRequest();
      request.id = 'MDL.001';
      request.name = 'Testing module update';
      request.icon = 'icon';

      const result = await moduleService.UpdateModule(request);

      expect(result.name).toEqual('Testing module update');
    });

    it('should fail update module data', async () => {
      const request = new UpdateModuleRequest();
      request.id = 'MDL.002';
      request.name = 'Testing module update';
      request.icon = 'icon';

      await expect(moduleService.UpdateModule(request)).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteModule', () => {
    it('should delete module data', async () => {
      const repospy = jest.spyOn(moduleRepo, 'DeleteModule');

      await moduleService.DeleteModule('MDL.001');

      expect(repospy).toBeCalledWith('MDL.001');
    });

    it('should fail delete module data', async () => {
      await expect(moduleService.DeleteModule('MDL.002')).rejects.toThrow(NotFoundException);
    });
  });
});
