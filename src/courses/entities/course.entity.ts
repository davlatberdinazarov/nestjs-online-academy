import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

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

  @ManyToOne(() => Category, (category) => category.courses, { eager: true, onDelete: 'CASCADE' })
  category: Category;

  @Column({ default: false }) // isSelled default qiymati false
  isSelled: boolean;

  @Column()
  banner: string;
}
