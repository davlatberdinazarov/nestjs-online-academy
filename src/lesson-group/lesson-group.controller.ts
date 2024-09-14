import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { CreateLessonGroupDto } from './dto/create-lesson-group.dto';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { LessonGroupsService } from './lesson-group.service';
import { Roles } from 'src/auth/roles.decorator';

@Controller('lesson-groups')
export class LessonGroupsController {
  constructor(private readonly lessonGroupsService: LessonGroupsService) {}

  @Post('create/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async create(
    @Body() createLessonGroupDto: CreateLessonGroupDto,
    @Param('courseId') courseId: number,
    @Request() req
  ) {
    const userId = req.user.id; // Token orqali foydalanuvchi ID olish
    return this.lessonGroupsService.create(createLessonGroupDto, userId, courseId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.lessonGroupsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.lessonGroupsService.findOne(id);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async update(
    @Param('id') id: number,
    @Body() updateLessonGroupDto: CreateLessonGroupDto,
    @Request() req
  ) {
    const userId = req.user.id; // Token orqali foydalanuvchi ID olish
    return this.lessonGroupsService.update(id, updateLessonGroupDto, userId);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async delete(@Param('id') id: number, @Request() req) {
    const userId = req.user.id; // Token orqali foydalanuvchi ID olish
    return this.lessonGroupsService.delete(id, userId);
  }
}
