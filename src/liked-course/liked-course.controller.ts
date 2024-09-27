import { Controller, Post, Body, Delete, Param, Get, UseGuards, Req, Query } from '@nestjs/common';
import { LikedCourseService } from './liked-course.service';
import { CreateLikedCourseDto } from './dto/create-liked-course.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { RequestWithUser } from 'src/users/interfaces/request-with-user.interface';

@Controller('liked-courses')
export class LikedCourseController {
  constructor(private readonly likedCoursesService: LikedCourseService) {}

  @Post('like')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async likeCourse(@Body() createLikeDto: CreateLikedCourseDto) {
    return this.likedCoursesService.likeCourse(createLikeDto);
  }

  @Delete('unlike/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async unlikeCourse(@Req() req: RequestWithUser, @Param('courseId') courseId: number) {
    const student = req.user;
    return this.likedCoursesService.unlikeCourse(student.id, courseId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async findLikedCourses(@Param('userId') userId: number) {
    return this.likedCoursesService.findLikedCoursesByUser(userId);
  }

  @Get('my-favorites')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async getMyFavorites(@Req() req: RequestWithUser) {
    const student = req.user;
    return this.likedCoursesService.findLikedCoursesByUser(student.id);
  }
}
