import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { LessonGroup } from 'src/lesson-group/entities/lesson-group.entity';
import { PurchasedCourse } from 'src/purchased-courses/entities/purchased-course.entity';
import { LikedCourse } from 'src/liked-course/entities/liked-course.entity';
import { Rating } from 'src/rating/entities/rating.entity';

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

  @OneToMany(() => LikedCourse, (likedCourse) => likedCourse.course)
  likedCourses: LikedCourse[];

  @Column({ default: 0 }) // Yangi maydon
  soldCount: number; // Sotilgan kurslar soni

  @OneToMany(() => Rating, (rating) => rating.course, { eager: true })
  ratings: Rating[];

  getAverageRating(): number {
    if (!this.ratings || this.ratings.length === 0) {
      return 0;
    }
    const total = this.ratings.reduce((sum, rating) => sum + rating.value, 0);
    return total / this.ratings.length;
  }
}
