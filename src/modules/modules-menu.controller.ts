import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { MODULES_MENU_SERVICES, ModulesMenuServices } from './modules-menu.service';
import { CreateModuleMenuRequest } from './request/create-module-menu.request';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Module Menus')
@Controller('modules-menu')
export class ModulesMenuController {
  constructor(@Inject(MODULES_MENU_SERVICES) private readonly services: ModulesMenuServices) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async SaveMenus(@Body() request: CreateModuleMenuRequest) {
    await this.services.SaveModulesMenu(request);

    return {
      code: HttpStatus.OK,
      status: 'OK',
    };
  }

  @Get('/:module_id')
  @HttpCode(HttpStatus.OK)
  GetMenus(@Param('module_id') module_id: string) {
    return this.services.GetModuleMenus(module_id);
  }
}
