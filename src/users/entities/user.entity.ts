import { Course } from 'src/courses/entities/course.entity';
import { LikedCourse } from 'src/liked-course/entities/liked-course.entity';
import { PurchasedCourse } from 'src/purchased-courses/entities/purchased-course.entity';
import { Rating } from 'src/rating/entities/rating.entity';
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
  image: string;

  @OneToMany(() => Course, (course) => course.creator)
  courses: Course[]; // Foydalanuvchi yaratgan kurslar

  @OneToMany(() => PurchasedCourse, (purchasedCourse) => purchasedCourse.student)
  purchasedCourses: PurchasedCourse[];

  @OneToMany(() => LikedCourse, (likedCourse) => likedCourse.user)
  likedCourses: LikedCourse[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @CreateDateColumn()
  createdAt: Date;
}
