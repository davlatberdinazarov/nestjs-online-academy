import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';

@Entity()
export class LessonGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Course, (course) => course.lessonGroups, { onDelete: 'CASCADE' })
  course: Course;
}
