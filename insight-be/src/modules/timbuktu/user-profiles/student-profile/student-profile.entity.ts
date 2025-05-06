// student-profile.entity.ts
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { AbstractBaseEntity } from 'src/common/base.entity';
import { User } from 'src/modules/user/user.model';

@Entity('student_profiles')
export class StudentProfileEntity extends AbstractBaseEntity {
  @Column({ nullable: false })
  studentId: number;

  @Column({ nullable: false })
  schoolYear: number;

  @OneToOne(() => User, (user) => user.studentProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
