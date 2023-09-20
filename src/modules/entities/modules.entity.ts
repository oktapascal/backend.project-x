import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('modules')
export class Modules {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ unique: true })
  module_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  status_active: boolean;

  @Column({ nullable: true })
  module_icon: string;
}
