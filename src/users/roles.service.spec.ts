import { Test, TestingModule } from '@nestjs/testing';
import { ROLES_REPOSITORIES, RolesRepositoriesImpl } from './roles.repositories';
import { ROLES_SERVICES, RolesServiceImpl } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlLiteDatasource } from '../test-utils/SqlLiteTestingModule';
import { CreateRoleRequest, UpdateRoleRequest } from './requests';
import { NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

describe('RolesService', () => {
  let repo: RolesRepositoriesImpl;
  let service: RolesServiceImpl;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRootAsync(SqlLiteDatasource), ConfigModule.forRoot({ envFilePath: '.env.dev' })],
      providers: [
        {
          provide: ROLES_REPOSITORIES,
          useClass: RolesRepositoriesImpl,
        },
        {
          provide: ROLES_SERVICES,
          useClass: RolesServiceImpl,
        },
      ],
    }).compile();

    repo = module.get<RolesRepositoriesImpl>(ROLES_REPOSITORIES);
    service = module.get<RolesServiceImpl>(ROLES_SERVICES);
  });

  it('roles repositories should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('roles services should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Save', () => {
    it('should save role', async () => {
      const repospy = jest.spyOn(repo, 'Save');

      const request = new CreateRoleRequest();
      request.name = 'Test Role';
      request.flag_read = true;
      request.flag_insert = true;
      request.flag_update = true;
      request.flag_delete = true;

      const result = await service.Save(request);

      expect(result.role_id).toBe('ROL.001');
      expect(repospy).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    it('should update role', async () => {
      const repospy = jest.spyOn(repo, 'Update');

      const request = new UpdateRoleRequest();
      request.name = 'Test Role update';
      request.flag_read = true;
      request.flag_insert = true;
      request.flag_update = true;
      request.flag_delete = true;

      const result = await service.Update('ROL.001', request);

      expect(result.name).toBe('Test Role update');
      expect(repospy).toHaveBeenCalled();
    });

    it('should fail update role', async () => {
      const request = new UpdateRoleRequest();
      request.name = 'Test Role update';
      request.flag_read = true;
      request.flag_insert = true;
      request.flag_update = true;
      request.flag_delete = true;

      await expect(service.Update('ROL.002', request)).rejects.toThrow(NotFoundException);
    });
  });

  describe('GetAll', () => {
    it('should show all role active', async () => {
      const repospy = jest.spyOn(repo, 'GetAll');

      const result = await service.GetAll();

      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(repospy).toHaveBeenCalled();
    });
  });

  describe('GetOne', () => {
    it('should show role based id', async () => {
      const repospy = jest.spyOn(repo, 'GetOne');

      const result = await service.GetOne('ROL.001');

      expect(result.role_id).toBe('ROL.001');
      expect(repospy).toHaveBeenCalled();
    });

    it('should fail show role based id', async () => {
      const result = await service.GetOne('ROL.002');

      expect(result).toEqual(null);
    });
  });

  describe('Delete', () => {
    it('should delete role by id', async () => {
      const repospy = jest.spyOn(repo, 'Delete');

      await service.Delete('ROL.001');

      expect(repospy).toHaveBeenCalledWith('ROL.001');
    });

    it('should fail delete role based id', async () => {
      await expect(service.Delete('ROL.002')).rejects.toThrow(NotFoundException);
    });
  });
});
