import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { LessonGroup } from 'src/lesson-group/entities/lesson-group.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, LessonGroup, User]),
    AuthModule
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
