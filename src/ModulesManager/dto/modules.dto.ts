import { Expose } from 'class-transformer';

export class ModulesDto {
  @Expose()
  module_id: string;

  @Expose()
  name: string;

  @Expose()
  module_icon: string;

  @Expose()
  default_view?: string;
}
