import { Test, TestingModule } from '@nestjs/testing';
import { MENUS_REPOSITORIES, MenusRepositoriesImpl } from '../reposiories/menus.repositories';
import { MENUS_SERVICES, MenusServicesImpl } from './menus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlLiteDatasource } from '../../test-utils/SqlLiteTestingModule';
import { CreateMenuRequest, UpdateMenuRequest } from '../request';
import { NotFoundException } from '@nestjs/common';

describe('MenusServices', () => {
  let menuRepositories: MenusRepositoriesImpl;
  let menuService: MenusServicesImpl;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRootAsync(SqlLiteDatasource)],
      providers: [
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

    menuRepositories = module.get<MenusRepositoriesImpl>(MENUS_REPOSITORIES);
    menuService = module.get<MenusServicesImpl>(MENUS_SERVICES);
  });

  it('menu repositories should be defined', () => {
    expect(menuRepositories).toBeDefined();
  });

  it('menu services should be defined', () => {
    expect(menuService).toBeDefined();
  });

  describe('SaveMenu', () => {
    const request = new CreateMenuRequest();
    request.name = 'test';
    request.icon = 'icon';
    request.path_url = 'url';

    it('should save menu data', async () => {
      const result = await menuService.SaveMenu(request);

      expect(result.name).toEqual('test');
    });
  });

  describe('UpdateMenu', () => {
    it('should update menu data', async () => {
      const request = new UpdateMenuRequest();
      request.menu_id = 'MEN.0001';
      request.name = 'nama menu';
      request.icon = 'icon update';
      request.path_url = 'url';

      const result = await menuService.UpdateMenu(request);

      expect(result.name).toEqual('nama menu');
    });

    it('should fail update menu data', async () => {
      const request = new UpdateMenuRequest();
      request.menu_id = 'MEN.0002';
      request.icon = 'icon';
      request.name = 'name icon';
      request.path_url = 'url';

      await expect(menuService.UpdateMenu(request)).rejects.toThrow(NotFoundException);
    });
  });

  describe('GetAllMenus', () => {
    it('should show all menu data', async () => {
      const repospy = jest.spyOn(menuRepositories, 'GetAllMenus');

      const result = await menuService.GetAllMenus();

      expect(repospy).toHaveBeenCalled();
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GetOneMenu', () => {
    it('should get menu data by id menu', async () => {
      const repospy = jest.spyOn(menuRepositories, 'GetOneMenu');

      const result = await menuService.GetOneMenu('MEN.0001');

      expect(result.menu_id).toEqual('MEN.0001');
      expect(repospy).toHaveBeenCalledWith('MEN.0001');
    });
  });

  describe('DeleteMenu', () => {
    it('should delete menu data', async () => {
      const repospy = jest.spyOn(menuRepositories, 'DeleteMenu');

      await menuService.DeleteMenu('MEN.0001');

      expect(repospy).toHaveBeenCalledWith('MEN.0001');
    });

    it('should fail delete menu data', async () => {
      await expect(menuService.DeleteMenu('MEN.0000')).rejects.toThrow(NotFoundException);
    });
  });
});
