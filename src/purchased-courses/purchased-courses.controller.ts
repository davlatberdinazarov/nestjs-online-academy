import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { PurchasedCoursesService } from './purchased-courses.service';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { RequestWithUser } from 'src/users/interfaces/request-with-user.interface';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';


@Controller('purchased-courses')
export class PurchasedCoursesController {
  constructor(private readonly purchasedCoursesService: PurchasedCoursesService) { }

  @Post('assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Faqat admin ruxsati
  async assignStudentToCourse(@Body() assignDto: { courseId: number, phone: string }, @Req() req: RequestWithUser) {
    const adminUser = req.user;
    const { courseId, phone } = assignDto;
    return this.purchasedCoursesService.assignStudentToCourse(courseId, phone, adminUser);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  async getMyCourses(@Req() req: RequestWithUser) {
    const student = req.user;
    return this.purchasedCoursesService.getCoursesByStudent(student.id);
  }

  @Get('mine/:course_id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  async getMyCourseById(
    @Param('course_id') courseId: number,
    @Req() req: RequestWithUser,
  ) {
    const student = req.user;
    return this.purchasedCoursesService.getCourseByIdForStudent(courseId, student.id);
  }

  @Get('course/:courseId/lesson-groups')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  async getLessonGroupsByCourse(
    @Param('courseId') courseId: number, 
    @Req() req: RequestWithUser
  ) {
    const student = req.user;
    const includeLessons = req.query.include_lessons === 'true'; // Querydan olingan parametr
  
    return this.purchasedCoursesService.getLessonGroupsByStudent(courseId, student.id, includeLessons);
  }
  


  @Get('course/:id/students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async getStudentsByCourse(@Param('id') courseId: number, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.purchasedCoursesService.getStudentsByCourse(courseId, currentUser);
  }
}