import { Test, TestingModule } from '@nestjs/testing';
import { MODULES_MENU_REPOSITORIES, ModulesMenuRepositoriesImpl } from './modules-menu.repositories';
import { MODULES_MENU_SERVICES, ModulesMenuServicesImpl } from './modules-menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlLiteDatasource } from '../test-utils/SqlLiteTestingModule';
import { CreateModuleMenuRequest } from './request/create-module-menu.request';

describe('ModulesMenuService', () => {
  let repo: ModulesMenuRepositoriesImpl;
  let service: ModulesMenuServicesImpl;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRootAsync(SqlLiteDatasource)],
      providers: [
        {
          provide: MODULES_MENU_REPOSITORIES,
          useClass: ModulesMenuRepositoriesImpl,
        },
        {
          provide: MODULES_MENU_SERVICES,
          useClass: ModulesMenuServicesImpl,
        },
      ],
    }).compile();

    repo = module.get<ModulesMenuRepositoriesImpl>(MODULES_MENU_REPOSITORIES);
    service = module.get<ModulesMenuServicesImpl>(MODULES_MENU_SERVICES);
  });

  it('modules menu services should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('modules menu service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SaveModulesMenu', () => {
    it('should success save menu data', async () => {
      const request = new CreateModuleMenuRequest();
      request.module_id = 'MDL.001';
      request.menus = [
        {
          name: 'Menu 1',
          path_url: '/menu1',
          status_active: true,
          children: [
            {
              name: 'Sub Menu 1',
              path_url: '/menu1/submenu1',
              status_active: true,
            },
            {
              name: 'Sub Menu 2',
              path_url: '/menu1/submenu2',
              status_active: true,
            },
          ],
        },
        {
          name: 'Menu 2',
          path_url: '/menu2',
          status_active: true,
          children: [
            {
              name: 'Sub Menu 2',
              path_url: '/menu2/submenu1',
              status_active: true,
            },
          ],
        },
      ];

      const repospy = jest.spyOn(repo, 'Save');

      await service.SaveModulesMenu(request);

      expect(repospy).toHaveBeenCalled();
    });
  });

  describe('GetModuleMenus', () => {
    it('should get all menus based module id', async () => {
      const result = await service.GetModuleMenus('MDL.001');

      expect(result.length).toBeGreaterThan(1);
    });
  });
});
