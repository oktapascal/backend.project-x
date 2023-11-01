import { Controller, Inject, Get, HttpCode, HttpStatus, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MODULES_SERVICES, ModulesServices } from '../services/modules.service';
import { CurrentUser } from '../../users/decorators';
import { Serialize } from '../../common/interceptors';
import { ModulesDto } from '../dto';
import { CreateModuleRequest, UpdateModuleRequest } from '../request';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Modules')
@Controller('module')
export class ModulesController {
  constructor(@Inject(MODULES_SERVICES) private readonly services: ModulesServices) {}

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  @Serialize(ModulesDto)
  GetModulesByUser(@CurrentUser() user: Express.User) {
    return this.services.GetModulesByUser(user['sub']);
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  GetModules() {
    return this.services.GetAllModules();
  }

  @Post('/save')
  @HttpCode(HttpStatus.CREATED)
  SaveModule(@Body() request: CreateModuleRequest) {
    return this.services.SaveModule(request);
  }

  @Put('/update')
  @HttpCode(HttpStatus.OK)
  UpdateModule(@Body() request: UpdateModuleRequest) {
    return this.services.UpdateModule(request);
  }

  @Delete('/delete/:module_id')
  @HttpCode(HttpStatus.OK)
  async DeleteModule(@Param('module_id') module_id: string) {
    await this.services.DeleteModule(module_id);

    return {
      code: HttpStatus.OK,
      status: 'OK',
    };
  }
}
