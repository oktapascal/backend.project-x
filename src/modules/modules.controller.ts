import { Controller, Inject, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { MODULES_SERVICES, ModulesServices } from './modules.service';
import { CurrentUser } from '../users/decorators';

@Controller('module')
export class ModulesController {
  constructor(@Inject(MODULES_SERVICES) private readonly modulesServices: ModulesServices) {}

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  GetModulesByUser(@CurrentUser() user: Express.User) {
    return this.modulesServices.GetModulesByUser(user['sub']);
  }
}
