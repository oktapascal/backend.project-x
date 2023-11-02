import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MENUS_SERVICES, MenusServices } from '../services/menus.service';
import { CreateMenuRequest, UpdateMenuRequest } from '../request';

@ApiTags('menu')
@Controller('menu')
export class MenusController {
  constructor(@Inject(MENUS_SERVICES) private readonly services: MenusServices) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  GetMenus() {
    return this.services.GetAllMenus();
  }

  @Get('/show/:menu_id')
  @HttpCode(HttpStatus.OK)
  GetMenu(@Param('menu_id') menu_id: string) {
    return this.services.GetOneMenu(menu_id);
  }

  @Post('/save')
  @HttpCode(HttpStatus.CREATED)
  SaveMenu(@Body() request: CreateMenuRequest) {
    return this.services.SaveMenu(request);
  }

  @Put('/update')
  @HttpCode(HttpStatus.OK)
  UpdateMenu(@Body() request: UpdateMenuRequest) {
    return this.services.UpdateMenu(request);
  }

  @Delete('/delete/:menu_id')
  @HttpCode(HttpStatus.OK)
  async DeleteMenu(@Param('menu_id') menu_id: string) {
    await this.services.DeleteMenu(menu_id);

    return {
      code: HttpStatus.OK,
      status: 'OK',
    };
  }
}
