import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto, UpdateCourseDto } from './dto/create-course.dto';
import { Category } from 'src/categories/entities/category.entity';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  // Kurs yaratish
  async create(createCourseDto: CreateCourseDto, user: User): Promise<Course> {
    const { categoryId, ...courseData } = createCourseDto;
  
    // Kategoriya mavjudligini tekshirish
    const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }
  
    // Kurs nomining unikalligini tekshirish
    const isNameUnique = await this.coursesRepository.findOne({ where: { name: courseData.name } });
    if (isNameUnique) {
      throw new BadRequestException('Course name must be unique');
    }
  
    // user obyektini tekshirish
    console.log('User object:', user);
  
    // Kurs yaratish
    const course = this.coursesRepository.create({
      ...courseData,
      category,
      creator: user, // creator sifatida foydalanuvchini qo'shamiz
    });
  
    try {
      return await this.coursesRepository.save(course);
    } catch (error) {
      console.error('Failed to create course:', error); // Log chiqarish xatoni tushunishga yordam beradi
      throw new InternalServerErrorException('Failed to create course');
    }
  }
  
  // Kurslarni olish
  async findAll() {
    return await this.coursesRepository.find({ relations: ['category', 'creator'] });
  }

  // Kursni yangilash
  async update(id: number, updateCourseDto: UpdateCourseDto, currentUser: User) {
    const course = await this.findOne(id);

    if (currentUser.role === UserRole.MENTOR && course.creator.id !== currentUser.id) {
      throw new ForbiddenException('You can only update your own courses');
    }

    const { categoryId, ...courseData } = updateCourseDto;

    if (categoryId) {
      const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        throw new NotFoundException(`Category with id ${categoryId} not found`);
      }
      course.category = category;
    }

    Object.assign(course, courseData);

    try {
      return await this.coursesRepository.save(course);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update course');
    }
  }

  // Kursni o'chirish
  async remove(id: number, currentUser: User) {
    const course = await this.findOne(id);

    if (currentUser.role === UserRole.MENTOR && course.creator.id !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    return await this.coursesRepository.remove(course);
  }

  // Kursni sotuvga chiqarish
  async sellCourse(id: number) {
    const course = await this.findOne(id);
    course.onActivated = true;
    return await this.coursesRepository.save(course);
  }

  // Kursni ID bo'yicha olish
  async findOne(id: number) {
    const course = await this.coursesRepository.findOne({ where: { id }, relations: ['category', 'creator'] });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return course;
  }
}
