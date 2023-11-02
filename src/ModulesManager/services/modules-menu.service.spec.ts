import { Test, TestingModule } from '@nestjs/testing';
import { MODULES_MENU_REPOSITORIES, ModulesMenuRepositoriesImpl } from '../reposiories/modules-menu.repositories';
import { MODULES_MENU_SERVICES, ModulesMenuServicesImpl } from './modules-menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlLiteDatasource } from '../../test-utils/SqlLiteTestingModule';
import { CreateModuleMenuRequest } from '../request/create-module-menu.request';
import { MENUS_REPOSITORIES, MenusRepositoriesImpl } from '../reposiories/menus.repositories';
import { MENUS_SERVICES, MenusServicesImpl } from './menus.service';
import { CreateMenuRequest } from '../request';

describe('ModulesMenuService', () => {
  let repo: ModulesMenuRepositoriesImpl;
  let service: ModulesMenuServicesImpl;

  let menuService: MenusServicesImpl;

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
        {
          provide: MENUS_REPOSITORIES,
          useClass: MenusRepositoriesImpl,
        },
        {
          provide: MENUS_SERVICES,
          useClass: MenusServicesImpl,
        },
      ],
    }).compile();

    repo = module.get<ModulesMenuRepositoriesImpl>(MODULES_MENU_REPOSITORIES);
    service = module.get<ModulesMenuServicesImpl>(MODULES_MENU_SERVICES);

    menuService = module.get<MenusServicesImpl>(MENUS_SERVICES);

    const request = new CreateMenuRequest();
    request.name = 'Test Menu 1';
    request.path_url = '/';
    request.icon = 'icon';

    await menuService.SaveMenu(request);

    request.name = 'Test Menu 2';
    request.path_url = '/';
    request.icon = 'icon';

    await menuService.SaveMenu(request);

    request.name = 'Test Menu 3';
    request.path_url = '/';
    request.icon = 'icon';

    await menuService.SaveMenu(request);
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
          menu_id: 'MEN.0001',
          status_active: true,
          children: [
            {
              menu_id: 'MEN.0002',
              status_active: true,
            },
            {
              menu_id: 'MEN.0003',
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

      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });
});
