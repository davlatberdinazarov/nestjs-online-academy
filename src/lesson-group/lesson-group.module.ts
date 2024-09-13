import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LessonGroup } from './entities/lesson-group.entity';
import { Course } from 'src/courses/entities/course.entity';
import { LessonGroupsController } from './lesson-group.controller';
import { LessonGroupsService } from './lesson-group.service';
import { User } from 'src/users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LessonGroup, Course, User]),
  AuthModule],
  controllers: [LessonGroupsController],
  providers: [LessonGroupsService],
})
export class LessonGroupsModule {}
