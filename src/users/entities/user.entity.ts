import { Course } from 'src/courses/entities/course.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  STUDENT = 'student',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT, // Default role - student
  })
  role: UserRole;

  @Column({ nullable: true })
  image: string; // Profil rasmi uchun maydon

  @OneToMany(() => Course, (course) => course.creator)
  courses: Course[];  // Foydalanuvchi yaratgan kurslar bilan bog'lanish

  @CreateDateColumn()
  createdAt: Date;
}
