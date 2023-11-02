import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Menus } from './menus.enitity';

@Entity('module_menus')
export class ModulesMenu {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ nullable: true })
  module_id: string;

  @Column({ nullable: true })
  serial_number: number;

  @Column({ nullable: true })
  menu_id: string;

  @Column({ nullable: true })
  status_active: boolean;

  @Column({ nullable: true })
  level: number;

  menu: Menus;
}
