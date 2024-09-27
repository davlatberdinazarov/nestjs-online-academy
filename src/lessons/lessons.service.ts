import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm';
import { LessonGroup } from 'src/lesson-group/entities/lesson-group.entity';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonGroup)
    private lessonGroupRepository: Repository<LessonGroup>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createLessonDto: CreateLessonDto, userId: number, LessonGroupId: number): Promise<Lesson> {
    const { name, description, videoUrl, duration } = createLessonDto;
    const lessonGroup = await this.lessonGroupRepository.findOne({ 
      where: { id: LessonGroupId },
      relations: ['course', 'course.creator'] 
    });

    if (!lessonGroup) {
      throw new NotFoundException(`LessonGroup with id ${LessonGroupId} does not exist`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist`);
    }

    if (user.role === UserRole.MENTOR && lessonGroup.course.creator.id !== userId) {
      throw new ForbiddenException('You do not have permission to create lessons in this course');
    }

    const lesson = this.lessonRepository.create({ name, description, videoUrl, duration, lessonGroup });

    return await this.lessonRepository.save(lesson);
}


  async findAllByLessonGroupId(groupId: number): Promise<Lesson[]> {
    const lessonGroup = await this.lessonGroupRepository.findOne({ where: { id: groupId },
    relations: ['lessons']});
    if (!lessonGroup) {
      throw new NotFoundException(`LessonGroup with id ${groupId} not found`);
    }
    return lessonGroup.lessons;
  }

  async findOne(id: number) {
    const lesson = await this.lessonRepository.findOne({ 
      where: { id },
      relations: ['lessonGroup', 'lessonGroup.course', 'lessonGroup.course.creator'] 
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }

    console.log(lesson); // Log orqali `creator` ni tekshirish
    return lesson;
}


async update(id: number, updateLessonDto: UpdateLessonDto, userId: number): Promise<Lesson> {
  const { name, description, videoUrl, duration } = updateLessonDto;
  const lesson = await this.lessonRepository.findOne({ 
    where: { id },
    relations: ['lessonGroup', 'lessonGroup.course', 'lessonGroup.course.creator'] 
  });

  if (!lesson) {
    throw new NotFoundException(`Lesson with id ${id} not found`);
  }

  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException(`User with id ${userId} not found`);
  }

  if (user.role === UserRole.MENTOR && lesson.lessonGroup.course.creator.id !== userId) {
    throw new ForbiddenException('You do not have permission to update lessons in this course');
  }

  lesson.name = name;
  lesson.description = description;
  lesson.videoUrl = videoUrl;
  lesson.duration = duration;

  return await this.lessonRepository.save(lesson);
}

  async delete(id: number, userId: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ 
      where: { id },
      relations: ['lessonGroup', 'lessonGroup.course', 'lessonGroup.course.creator'] 
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (user.role === UserRole.MENTOR && lesson.lessonGroup.course.creator.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete lessons in this course');
    }

    await this.lessonRepository.remove(lesson);
    return lesson;
  }
}
