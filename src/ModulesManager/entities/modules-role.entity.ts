import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role_modules')
export class ModulesRole {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ nullable: true })
  module_id: string;

  @Column({ nullable: true })
  role_id: string;

  @Column({ nullable: true })
  status_active: boolean;
}
