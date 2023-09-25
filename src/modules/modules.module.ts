import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ModulesController } from './modules.controller';
import { MODULES_REPOSITORIES, ModulesRepositoriesImpl } from './modules.repositories';
import { MODULES_SERVICES, ModulesServicesImpl } from './modules.service';
import { AccessTokenGuard } from '../common/guards';
import { ModulesRoleController } from './modules-role.controller';

@Module({
  controllers: [ModulesController, ModulesRoleController],
  providers: [
    { provide: MODULES_REPOSITORIES, useClass: ModulesRepositoriesImpl },
    { provide: MODULES_SERVICES, useClass: ModulesServicesImpl },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class ModulesModule {}
