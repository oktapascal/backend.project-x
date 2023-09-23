import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ unique: true })
  user_id: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  remember_token: string;

  @Column({ nullable: true })
  role_id: string;

  @Column({ nullable: true })
  activated: boolean;

  @Column({ nullable: true })
  created_at: string;

  @Column({ nullable: true })
  updated_at: Date;

  profile: UserProfile;
}
