import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { LessonGroup } from 'src/lesson-group/entities/lesson-group.entity';
import { PurchasedCourse } from 'src/purchased-courses/entities/purchased-course.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.courses, { eager: true, onDelete: 'CASCADE' })
  category: Category;

  @Column({ default: false })
  onActivated: boolean;

  @Column()
  banner: string;

  @ManyToOne(() => User, (user) => user.courses, { eager: true, onDelete: 'SET NULL' })
  creator: User;  // Kurs yaratuvchisi

  @OneToMany(() => LessonGroup, (lessonGroup) => lessonGroup.course)
  lessonGroups: LessonGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PurchasedCourse, (purchasedCourse) => purchasedCourse.course)
  students: PurchasedCourse[];

  @Column({ default: 0 }) // Yangi maydon
  soldCount: number; // Sotilgan kurslar soni
}
