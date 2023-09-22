import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('module_menus')
export class ModulesMenu {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ nullable: true })
  module_id: string;

  @Column({ nullable: true })
  serial_number: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  path_url: string;

  @Column({ nullable: true })
  status_active: boolean;
}
