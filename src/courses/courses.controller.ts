import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { RequestWithUser } from 'src/users/interfaces/request-with-user.interface';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('create-course')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  create(@Body() createCourseDto: CreateCourseDto, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.coursesService.create(createCourseDto, currentUser);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('single-full/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  findSingleFull(@Param('id') id: number) {
    return this.coursesService.findOne(id);
  }

  @Get()
  findAllActiveCourses() {
    return this.coursesService.findActiveCourses();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMyCourses(@Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.coursesService.findCoursesByUser(currentUser);
  }

  @Get('single/:id')
  findActiveCourse(@Param('id') id: number) {
    return this.coursesService.findActiveCoursesById(id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.coursesService.update(id, updateCourseDto, currentUser);
  }

  @Patch('activate/:id/sell')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  sellCourse(@Param('id') id: number) {
    return this.coursesService.sellCourse(id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  remove(@Param('id') id: number, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.coursesService.remove(id, currentUser);
  }
}
