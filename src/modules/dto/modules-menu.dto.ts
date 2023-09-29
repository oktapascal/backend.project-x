export class ModulesMenuDto {
  module_id?: string;
  serial_number: number;
  name: string;
  path_url: string;
  status_active?: boolean;
  level?: number;
  children?: ModulesMenuDto[];
}
