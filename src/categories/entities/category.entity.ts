import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Course, (course) => course.category)
  courses: Course[];

  
  @CreateDateColumn()
  createdAt: Date;
}