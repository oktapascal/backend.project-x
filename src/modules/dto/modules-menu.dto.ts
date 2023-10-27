export class ModulesMenuDto {
  module_id?: string;
  serial_number: number;
  name: string;
  path_url: string;
  menu_icon: string;
  status_active?: boolean;
  level?: number;
  children?: ModulesMenuDto[];
}
