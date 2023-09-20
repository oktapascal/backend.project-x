import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_modules')
export class ModulesUser {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ nullable: true })
  module_id: number;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  status_active: boolean;
}
