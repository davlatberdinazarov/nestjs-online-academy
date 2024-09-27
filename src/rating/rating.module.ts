import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { Rating } from './entities/rating.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course, User, Rating]),
    AuthModule],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule { }
