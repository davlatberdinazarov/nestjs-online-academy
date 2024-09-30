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

    @Column()
    duration: string;

    @ManyToOne(() => LessonGroup, (lessonGroup) => lessonGroup.lessons, { onDelete: 'CASCADE' })
    lessonGroup: LessonGroup;

    // Yangi 'viewed' maydonini qo'shish
    @Column({ default: false })  // Standart qiymati false, ya'ni ko'rilmagan deb belgilanadi
    viewed: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
