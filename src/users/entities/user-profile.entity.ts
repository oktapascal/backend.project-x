import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ unique: true })
  user_id: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  updated_at: Date;
}
