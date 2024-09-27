import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LikedCourse } from './entities/liked-course.entity';
import { CreateLikedCourseDto } from './dto/create-liked-course.dto';

@Injectable()
export class LikedCourseService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(LikedCourse) private likedCourseRepository: Repository<LikedCourse>,
  ) {}

  // Like a course
  async likeCourse(createLikeDto: CreateLikedCourseDto) {
    const { userId, courseId } = createLikeDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const likedCourse = this.likedCourseRepository.create({ user, course });
    await this.likedCourseRepository.save(likedCourse);

    return { message: 'Course liked successfully' };
  }

  // Unlike a course
  async unlikeCourse(userId: number, courseId: number) {
    const likedCourse = await this.likedCourseRepository.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
    });

    if (!likedCourse) {
      throw new NotFoundException('Like not found');
    }

    await this.likedCourseRepository.remove(likedCourse);

    return { message: 'Course unliked successfully' };
  }

  // Get all liked courses of a user
  async findLikedCoursesByUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likedCourses', 'likedCourses.course'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.likedCourses.map(like => like.course);
  }
  
}
