import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';
import { Course } from 'src/courses/entities/course.entity';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async calculateAverageRating(courseId: number): Promise<number> {
    const courseRatings = await this.ratingRepository.find({ where: { course: { id: courseId } } });
    if (courseRatings.length === 0) {
      return 0;
    }
    const total = courseRatings.reduce((sum, rating) => sum + rating.value, 0);
    return total / courseRatings.length;
  }
  

  async create(createRatingDto: CreateRatingDto, userId: number) {
    const { courseId, value, comment } = createRatingDto;

    // Kursni topish
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    // Reytingni topish, agar foydalanuvchi allaqachon baholagan bo'lsa
    const existingRating = await this.ratingRepository.findOne({
      where: { course: { id: courseId }, user: { id: userId } }
    });

    if (existingRating) {
      throw new ForbiddenException('Siz allaqachon bu kursni baholagansiz');
    }

    // Reytingni yaratish
    const rating = this.ratingRepository.create({
      value,
      comment,
      course, // Kursni bog'lash
      user: { id: userId }, // Foydalanuvchini bog'lash
    });

    return await this.ratingRepository.save(rating); // Saqlash
  }

  async findAll(): Promise<Rating[]> {
    return await this.ratingRepository.find();
  }

  async findOne(id: number): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({ where: { id } });
    if (!rating) {
      throw new NotFoundException('Reyting topilmadi');
    }
    return rating;
  }

  async update(id: number, updateRatingDto: UpdateRatingDto, userId: number) {
    const rating = await this.ratingRepository.findOne({
      where: { id },
      relations: ['user'], // `user` aloqasini yuklash
    });

    if (!rating) {
      throw new NotFoundException('Reyting topilmadi');
    }

    // Foydalanuvchi ID'sini tekshirish
    if (rating.user.id !== userId) {
      throw new ForbiddenException('Siz faqat o\'zingiz yaratgan reytingni yangilay olasiz');
    }

    // Faqat comment ni yangilash
    if (updateRatingDto.comment) {
      rating.comment = updateRatingDto.comment; // Faqat comment ni yangilash
    }

    return await this.ratingRepository.save(rating);
  }


  async remove(id: number, userId: number): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({ where: { id }, relations: ['user'] });

    if (!rating) {
      throw new NotFoundException('Reyting topilmadi');
    }

    // Admin rolini tekshirish
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Sizda reytingni o\'chirish huquqi yo\'q');
    }

    await this.ratingRepository.delete(id);

    return rating; // O'chirilgan reyting ma'lumotlarini qaytarish
  }

}
