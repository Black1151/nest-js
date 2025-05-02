// educator-profile.entity.ts
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { User } from 'src/modules/user/user.model';

@Entity('educator_profiles')
export class EducatorProfileEntity extends AbstractBaseEntity {
  @Column({ nullable: false })
  staffId: number;

  @OneToOne(() => User, (user) => user.educatorProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
