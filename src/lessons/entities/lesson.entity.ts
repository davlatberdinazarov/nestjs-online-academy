import { LessonGroup } from "src/lesson-group/entities/lesson-group.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    videoUrl: string;

    @ManyToOne(() => LessonGroup, (lessonGroup) => lessonGroup.lessons, { onDelete: 'CASCADE' })
    lessonGroup: LessonGroup;
    
    @CreateDateColumn()
    createdAt: Date;
}
    