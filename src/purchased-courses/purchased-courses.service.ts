import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PurchasedCourse } from './entities/purchased-course.entity';
import { Course } from 'src/courses/entities/course.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { LessonGroup } from 'src/lesson-group/entities/lesson-group.entity';

@Injectable()
export class PurchasedCoursesService {
  constructor(
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(PurchasedCourse) private purchasedCourseRepository: Repository<PurchasedCourse>,
  ) { }

  async getCoursesByStudent(studentId: number): Promise<Course[]> {
    const purchasedCourses = await this.purchasedCourseRepository.find({
      where: { student: { id: studentId } },
      relations: ['course'],
    });

    // Faqat kurslarni qaytaramiz
    return purchasedCourses.map(purchasedCourse => purchasedCourse.course);
  }

  async getLessonGroupsByStudent(courseId: number, studentId: number, includeLessons: boolean): Promise<LessonGroup[]> {
    const purchasedCourse = await this.purchasedCourseRepository.findOne({
      where: { course: { id: courseId }, student: { id: studentId } },
      relations: includeLessons 
        ? ['course', 'course.lessonGroups', 'course.lessonGroups.lessons'] 
        : ['course', 'course.lessonGroups'], // Agar kerak bo'lsa darslarni qo'shamiz
    });
  
    if (!purchasedCourse) {
      throw new NotFoundException(`Course with id ${courseId} not found for this student`);
    }
  
    return purchasedCourse.course.lessonGroups; // Dars guruhlarini qaytaramiz
  }
  


  async getCourseByIdForStudent(courseId: number, studentId: number): Promise<Course> {
    const purchasedCourse = await this.purchasedCourseRepository.findOne({
      where: { course: { id: courseId }, student: { id: studentId } },
      relations: ['course'],
    });

    if (!purchasedCourse) {
      throw new NotFoundException(`Course with id ${courseId} not found for this student`);
    }

    return purchasedCourse.course;
  }

  async getStudentsByCourse(courseId: number, currentUser: User): Promise<User[]> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
      relations: ['creator', 'students', 'students.student'], // students bilan birga studentlar ham chaqiriladi
    });

    if (!course) {
      throw new NotFoundException(`Course with id ${courseId} not found`);
    }

    // Faqat mentorlar o'z kurslarining o'quvchilarini ko'ra oladi
    if (currentUser.role === UserRole.MENTOR && course.creator.id !== currentUser.id) {
      throw new ForbiddenException('You can only view students for your own courses');
    }

    // PurchasedCourse[] dan User[] ni olish
    const students = course.students.map(purchasedCourse => purchasedCourse.student);

    return students;
  }

  // Studentni kursga biriktirish (faqat adminlar uchun)
  async assignStudentToCourse(courseId: number, phone: string, adminUser: User): Promise<PurchasedCourse> {
    // Faqat admin foydalanuvchilar uchun
    if (adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Faqat adminlar studentlarni kursga biriktirishi mumkin');
    }
  
    // Kurs mavjudligini tekshirish
    const course = await this.coursesRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException(`Kurs topilmadi id: ${courseId}`);
    }
  
    // Studentni telefon orqali qidirish
    const student = await this.usersRepository.findOne({ where: { phone } });
    if (!student) {
      throw new NotFoundException(`Student topilmadi phone: ${phone}`);
    }
  
    // Kursga biriktirilganligini tekshirish
    const existingPurchase = await this.purchasedCourseRepository.findOne({
      where: { course: { id: courseId }, student: { id: student.id } }
    });
  
    if (existingPurchase) {
      throw new ForbiddenException('Student ushbu kursga allaqachon biriktirilgan');
    }
  
    // Yangi birikma yaratish
    const purchasedCourse = this.purchasedCourseRepository.create({
      course,
      student,
    });
  
    // Sold count ni yangilash
    course.soldCount += 1; // Sotilgan kurslar sonini oshirish
    await this.coursesRepository.save(course); // Kursni saqlash
  
    return this.purchasedCourseRepository.save(purchasedCourse);
  }
  
}
