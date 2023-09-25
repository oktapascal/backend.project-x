import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateModuleRoleRequest } from './request';

@Controller('module-role')
export class ModulesRoleController {
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  Save(@Body() request: CreateModuleRoleRequest) {
    console.log(request);
  }
}
