import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLessonGroupDto } from './dto/create-lesson-group.dto';
import { LessonGroup } from './entities/lesson-group.entity';
import { Course } from 'src/courses/entities/course.entity';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class LessonGroupsService {
  constructor(
    @InjectRepository(LessonGroup)
    private lessonGroupsRepository: Repository<LessonGroup>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createLessonGroupDto: CreateLessonGroupDto, userId: number, courseId: number): Promise<LessonGroup> {
    const { name } = createLessonGroupDto;
    const course = await this.coursesRepository.findOne({ where: { id: courseId }, relations: ['creator'] });
  
    if (!course) {
      throw new NotFoundException(`Course with id ${courseId} not found`);
    }
  
    const user = await this.usersRepository.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  
    // Adminlar va mentorlar uchun ruxsat berish
    if (user.role === UserRole.MENTOR && course.creator.id !== userId) {
      throw new ForbiddenException('You do not have permission to create lesson groups for this course');
    }
  
    const lessonGroup = this.lessonGroupsRepository.create({
      name,
      course,
    });
  
    return await this.lessonGroupsRepository.save(lessonGroup);
  }
  
  async findAllByCourseId(courseId: number, includeLessons: boolean): Promise<LessonGroup[]> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
      relations: includeLessons ? ['lessonGroups', 'lessonGroups.lessons'] : ['lessonGroups'], // `lessons`ni faqat queryda bo'lsa olib kelamiz
    });
  
    if (!course) {
      throw new NotFoundException(`Course with id ${courseId} not found`);
    }
  
    return course.lessonGroups;
  }

  async findOne(id: number) {
    const lessonGroup = await this.lessonGroupsRepository.findOne({ where: { id }, relations: ['course'] });
    if (!lessonGroup) {
      throw new NotFoundException(`LessonGroup with id ${id} not found`);
    }
    return lessonGroup;
  }


  async update(id: number, updateLessonGroupDto: CreateLessonGroupDto, userId: number): Promise<LessonGroup> {
    const { name } = updateLessonGroupDto;
    const lessonGroup = await this.lessonGroupsRepository.findOne({ where: { id }, relations: ['course'] });
  
    if (!lessonGroup) {
      throw new NotFoundException(`LessonGroup with id ${id} not found`);
    }
  
    const user = await this.usersRepository.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  
    // Adminlar va mentorlar uchun ruxsat berish
    if (user.role === UserRole.MENTOR && lessonGroup.course.creator.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this lesson group');
    }
  
    lessonGroup.name = name;
    return await this.lessonGroupsRepository.save(lessonGroup);
  }
  

  async delete(id: number, userId: number): Promise<void> {
    const lessonGroup = await this.lessonGroupsRepository.findOne({ where: { id }, relations: ['course'] });
  
    if (!lessonGroup) {
      throw new NotFoundException(`LessonGroup with id ${id} not found`);
    }
  
    const user = await this.usersRepository.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  
    // Adminlar va mentorlar uchun ruxsat berish
    if (user.role === UserRole.MENTOR && lessonGroup.course.creator.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this lesson group');
    }
  
    await this.lessonGroupsRepository.remove(lessonGroup);
    
  }
  
}
