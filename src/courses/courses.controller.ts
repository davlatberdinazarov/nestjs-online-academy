import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { RequestWithUser } from 'src/users/interfaces/request-with-user.interface';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('create-course')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  create(@Body() createCourseDto: CreateCourseDto, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.coursesService.create(createCourseDto, currentUser);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('byId/:id')
  findOne(@Param('id') id: number) {
    return this.coursesService.findOne(id);
  }

  @Patch('update/:id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.coursesService.update(id, updateCourseDto, currentUser);
  }

  @Patch('activate/:id/sell')
  @Roles(UserRole.ADMIN)
  sellCourse(@Param('id') id: number) {
    return this.coursesService.sellCourse(id);
  }

  @Delete('delete/:id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  remove(@Param('id') id: number, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.coursesService.remove(id, currentUser);
  }
}
