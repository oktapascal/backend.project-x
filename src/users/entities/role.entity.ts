import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ nullable: true })
  role_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  status_active: boolean;

  @Column({ nullable: true })
  flag_read: boolean;

  @Column({ nullable: true })
  flag_insert: boolean;

  @Column({ nullable: true })
  flag_update: boolean;

  @Column({ nullable: true })
  flag_delete: boolean;
}
