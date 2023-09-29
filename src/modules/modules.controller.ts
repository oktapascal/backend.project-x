import { Controller, Inject, Get, HttpCode, HttpStatus, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MODULES_SERVICES, ModulesServices } from './modules.service';
import { CurrentUser } from '../users/decorators';
import { Serialize } from '../common/interceptors';
import { ModulesDto } from './dto';
import { CreateModuleRequest, UpdateModuleRequest } from './request';

@Controller('module')
export class ModulesController {
  constructor(@Inject(MODULES_SERVICES) private readonly services: ModulesServices) {}

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  @Serialize(ModulesDto)
  GetModulesByUser(@CurrentUser() user: Express.User) {
    return this.services.GetModulesByUser(user['sub']);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  SaveModule(@Body() request: CreateModuleRequest) {
    return this.services.SaveModule(request);
  }

  @Patch('/')
  @HttpCode(HttpStatus.OK)
  UpdateModule(@Body() request: UpdateModuleRequest) {
    return this.services.UpdateModule(request);
  }

  @Delete('/:module_id')
  @HttpCode(HttpStatus.OK)
  async DeleteModule(@Param('module_id') module_id: string) {
    await this.services.DeleteModule(module_id);

    return {
      code: HttpStatus.OK,
      status: 'OK',
    };
  }
}
