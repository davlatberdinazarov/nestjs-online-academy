import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasedCoursesService } from './purchased-courses.service';
import { PurchasedCoursesController } from './purchased-courses.controller';

import { PurchasedCourse } from './entities/purchased-course.entity';
import { AuthModule } from '../auth/auth.module';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, User, PurchasedCourse]),
    AuthModule, // Authentication and roles guard
  ],
  controllers: [PurchasedCoursesController],
  providers: [PurchasedCoursesService],
})
export class PurchasedCoursesModule {}
