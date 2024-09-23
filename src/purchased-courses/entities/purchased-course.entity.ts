import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class PurchasedCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.students)
  course: Course;

  @ManyToOne(() => User, (user) => user.purchasedCourses)
  student: User;
}
