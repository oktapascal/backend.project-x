import { Expose } from 'class-transformer';

export class MenusDto {
  @Expose()
  menu_id: string;

  @Expose()
  name: string;

  @Expose()
  menu_icon: string;

  @Expose()
  path_url: string;
}
