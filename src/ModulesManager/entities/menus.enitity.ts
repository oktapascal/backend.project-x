import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('menus')
export class Menus {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ unique: true })
  menu_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  menu_icon: string;

  @Column({ nullable: true })
  path_url: string;

  @Column({ nullable: true })
  status_active: boolean;
}
