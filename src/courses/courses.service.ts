import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto, UpdateCourseDto } from './dto/create-course.dto';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const { categoryId, ...courseData } = createCourseDto;
    const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }
    const course = this.coursesRepository.create({ ...courseData, category });
    return await this.coursesRepository.save(course);
  }

  async findAll() {
    return await this.coursesRepository.find();
  }

  async findOne(id: number) {
    const course = await this.coursesRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    const { categoryId, ...courseData } = updateCourseDto;

    if (categoryId) {
      const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        throw new NotFoundException(`Category with id ${categoryId} not found`);
      }
      course.category = category;
    }

    Object.assign(course, courseData);
    return await this.coursesRepository.save(course);
  }

  async sellCourse(id: number) {
    const course = await this.findOne(id);
    course.isSelled = true; // isSelled ni true qilib qo'yish
    return await this.coursesRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.findOne(id);
    return await this.coursesRepository.remove(course);
  }
}
