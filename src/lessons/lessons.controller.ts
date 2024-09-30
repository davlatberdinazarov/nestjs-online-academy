import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request, NotFoundException, Put } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) { }

  @Post('create/:lessonGroupId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async create(
    @Param('lessonGroupId') lessonGroupId: number,
    @Body() createLessonDto: CreateLessonDto,
    @Request() req
  ) {
    const userId = req.user.id; // Token orqali foydalanuvchi ID olish
    return this.lessonsService.create(createLessonDto, userId, lessonGroupId);
  }


  @Get('group/:lessonGroupId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async findAllByLessonGroupId(@Param('lessonGroupId') lessonGroupId: string) {
    const id = parseInt(lessonGroupId, 10); // lessonGroupId ni number ga aylantirish
    if (isNaN(id)) {
      throw new NotFoundException(`Invalid lesson group ID: ${lessonGroupId}`);
    }
    return await this.lessonsService.findAllByLessonGroupId(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async findOne(@Param('id') id: number) {
    return await this.lessonsService.findOne(+id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async update(
    @Param('id') id: number,
    @Body() updateLessonDto: UpdateLessonDto,
    @Request() req
  ) {
    const userId = req.user.id; // Token orqali foydalanuvchi ID olish
    return this.lessonsService.update(id, updateLessonDto, userId);
  }

  @Put('/view/:lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async viewLesson(
    @Param('lessonId') lessonId: number,
    @Body('view') viewStatus: boolean,
    @Request() req,  // `@Request()` orqali `req` obyektini olish
  ) {
    const userId = req.user.id; // `req.user` orqali foydalanuvchi ma'lumotlarini olish
    return this.lessonsService.viewLesson(lessonId, userId, viewStatus);
  }
  


  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async delete(@Param('id') id: number, @Request() req) {
    const userId = req.user.id; // Token orqali foydalanuvchi ID olish
    return await this.lessonsService.delete(id, userId);
  }
}
