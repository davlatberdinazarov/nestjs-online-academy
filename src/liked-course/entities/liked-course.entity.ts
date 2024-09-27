import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


@Entity()
export class LikedCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likedCourses)
  user: User;

  @ManyToOne(() => Course, (course) => course.likedCourses)
  course: Course;
}
    