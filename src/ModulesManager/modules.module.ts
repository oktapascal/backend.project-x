import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ModulesController } from './controllers/modules.controller';
import { MODULES_REPOSITORIES, ModulesRepositoriesImpl } from './reposiories/modules.repositories';
import { MODULES_SERVICES, ModulesServicesImpl } from './services/modules.service';
import { AccessTokenGuard } from '../common/guards';
import { ModulesRoleController } from './controllers/modules-role.controller';
import { MODULES_ROLE_SERVICES, ModulesRoleServiceImpl } from './services/modules-role.service';
import { MODULES_MENU_REPOSITORIES, ModulesMenuRepositoriesImpl } from './reposiories/modules-menu.repositories';
import { MODULES_MENU_SERVICES, ModulesMenuServicesImpl } from './services/modules-menu.service';
import { MODULES_ROLE_REPOSITORIES, ModulesRoleRepositoriesImpl } from './reposiories/modules-role.repositories';
import { ModulesMenuController } from './controllers/modules-menu.controller';
import { MenusController } from './controllers/menus.controller';
import { MENUS_REPOSITORIES, MenusRepositoriesImpl } from './reposiories/menus.repositories';
import { MENUS_SERVICES, MenusServicesImpl } from './services/menus.service';

@Module({
  controllers: [ModulesController, ModulesRoleController, ModulesMenuController, MenusController],
  providers: [
    { provide: MODULES_REPOSITORIES, useClass: ModulesRepositoriesImpl },
    { provide: MODULES_SERVICES, useClass: ModulesServicesImpl },
    { provide: MODULES_ROLE_REPOSITORIES, useClass: ModulesRoleRepositoriesImpl },
    { provide: MODULES_ROLE_SERVICES, useClass: ModulesRoleServiceImpl },
    { provide: MODULES_MENU_REPOSITORIES, useClass: ModulesMenuRepositoriesImpl },
    { provide: MODULES_MENU_SERVICES, useClass: ModulesMenuServicesImpl },
    { provide: MENUS_REPOSITORIES, useClass: MenusRepositoriesImpl },
    { provide: MENUS_SERVICES, useClass: MenusServicesImpl },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class ModulesModule {}
