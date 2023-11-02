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

export class ModulesMenuCreateDto {
  module_id: string;
  menu_id: string;
  serial_number: number;
  status_active: boolean;
  level: number;
  children?: ModulesMenuDto[];
}
