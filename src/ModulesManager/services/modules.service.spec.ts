import { Test, TestingModule } from '@nestjs/testing';
import { MODULES_SERVICES, ModulesServicesImpl } from './modules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlLiteDatasource } from '../../test-utils/SqlLiteTestingModule';
import { MODULES_REPOSITORIES, ModulesRepositoriesImpl } from '../reposiories/modules.repositories';
import { CreateModuleRequest, UpdateModuleRequest } from '../request';
import { NotFoundException } from '@nestjs/common';

describe('ModulesService', () => {
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
    request.default_view = '/default';

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
      request.default_view = '/default-update';

      const result = await moduleService.UpdateModule(request);

      expect(result.name).toEqual('Testing module update');
    });

    it('should fail update module data', async () => {
      const request = new UpdateModuleRequest();
      request.id = 'MDL.002';
      request.name = 'Testing module update';
      request.icon = 'icon';
      request.default_view = '/default-update';

      await expect(moduleService.UpdateModule(request)).rejects.toThrow(NotFoundException);
    });
  });

  describe('GetAllModules', () => {
    it('should show all module data', async () => {
      const repospy = jest.spyOn(moduleRepo, 'GetAllModules');

      const result = await moduleService.GetAllModules();

      expect(repospy).toHaveBeenCalled();
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GetOneModule', () => {
    it('should get module data by id module', async () => {
      const repospy = jest.spyOn(moduleRepo, 'GetOneModule');

      const result = await moduleService.GetOneModule('MDL.001');

      expect(result.module_id).toEqual('MDL.001');
      expect(repospy).toHaveBeenCalledWith('MDL.001');
    });
  });

  describe('DeleteModule', () => {
    it('should delete module data', async () => {
      const repospy = jest.spyOn(moduleRepo, 'DeleteModule');

      await moduleService.DeleteModule('MDL.001');

      expect(repospy).toHaveBeenCalledWith('MDL.001');
    });

    it('should fail delete module data', async () => {
      await expect(moduleService.DeleteModule('MDL.002')).rejects.toThrow(NotFoundException);
    });
  });
});
