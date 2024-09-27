import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number; // Reyting qiymati

  @Column({ nullable: true })
  comment: string; // Izoh

  @ManyToOne(() => Course, (course) => course.ratings)
  course: Course; // Kurs bilan bog‘lanadi

  @ManyToOne(() => User, (user) => user.ratings)
  user: User; // Foydalanuvchi bilan bog‘lanadi
}
