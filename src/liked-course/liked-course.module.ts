import { Module } from '@nestjs/common';
import { LikedCourseService } from './liked-course.service';
import { LikedCourseController } from './liked-course.controller';
import { User } from 'src/users/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';
import { LikedCourse } from './entities/liked-course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, LikedCourse]),
 AuthModule],
  controllers: [LikedCourseController],
  providers: [LikedCourseService],
})
export class LikedCourseModule {}
