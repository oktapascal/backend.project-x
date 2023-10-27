import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { CreateModuleRoleRequest } from './request';
import { MODULES_ROLE_SERVICES, ModulesRoleService } from './modules-role.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role Modules')
@Controller('module-role')
export class ModulesRoleController {
  constructor(@Inject(MODULES_ROLE_SERVICES) private readonly service: ModulesRoleService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  Save(@Body() request: CreateModuleRoleRequest) {
    return this.service.SaveModulesRole(request);
  }
}
