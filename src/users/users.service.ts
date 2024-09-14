import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  // Foydalanuvchi yaratish (ro'yxatdan o'tkazish yoki mentor yaratish)
  // Foydalanuvchi yaratish
  async create(createUserDto: CreateUserDto) {
    const { fullName, phone, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Telefon orqali foydalanuvchini tekshirish
    const existingUser = await this.findOneByPhone(phone);
    if (existingUser) {
      throw new BadRequestException('Phone number already exists');
    }

    // Rolni har doim `STUDENT` qilib belgilash
    const newUser = this.usersRepository.create({
      fullName,
      phone,
      password: hashedPassword,
      role: UserRole.STUDENT,  // Roli avtomatik tarzda `STUDENT` qilindi
    });

    return await this.usersRepository.save(newUser);
  }


  async createMentor(createUserDto: CreateUserDto, currentUserRole: UserRole) {
    const { fullName, phone, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Telefon raqami orqali foydalanuvchini tekshirish
    const existingUser = await this.findOneByPhone(phone);
    if (existingUser) {
      throw new BadRequestException('Phone number already exists');
    }

    // Faqat admin foydalanuvchilar mentor yaratishi mumkin
    if (currentUserRole === UserRole.ADMIN) {
      const newMentor = this.usersRepository.create({
        fullName,
        phone,
        password: hashedPassword,
        role: UserRole.MENTOR,  // Roli avtomatik tarzda 'MENTOR' o'rnatiladi
      });
      return await this.usersRepository.save(newMentor);
    } else {
      throw new ForbiddenException('Only admins can create mentor users');
    }
  }

  async createAdmin(createUserDto: CreateUserDto, currentUserRole: UserRole) {
    const { fullName, phone, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Telefon raqami orqali foydalanuvchini tekshirish
    const existingUser = await this.findOneByPhone(phone);
    if (existingUser) {
      throw new BadRequestException('Phone number already exists');
    }

    // Admin roli orqali foydalanuvchini yaratish
    if (currentUserRole === UserRole.ADMIN) {
      const newAdmin = this.usersRepository.create({
        fullName,
        phone,
        password: hashedPassword,
        role: UserRole.ADMIN,  // Roli avtomatik tarzda 'ADMIN' o'rnatiladi
      });
      return await this.usersRepository.save(newAdmin);
    } else {
      throw new ForbiddenException('Only admins can create admin users');
    }
  }
  // Telefon raqam orqali foydalanuvchini topish
  async findOneByPhone(phone: string) {
    return await this.usersRepository.findOne({ where: { phone } });
  }

  // Barcha foydalanuvchilarni olish
  async findAll() {
    return await this.usersRepository.find();
  }

  // Foydalanuvchini yangilash
  async update(id: number, updateUserDto: CreateUserDto, currentUserRole: UserRole) {
    // Find the user with the specified ID and ensure they have the role of MENTOR
    const user = await this.usersRepository.findOne({ where: { id, role: UserRole.MENTOR } });
  
    if (!user) {
      throw new NotFoundException('Mentor not found');
    }

    // Update mentor user
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }
  

  async delete(id: number, currentUserRole: UserRole) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.delete(id);
    return { deleted: true };
  }


  // ID bo'yicha foydalanuvchini topish
  async findOne(id: number) {
    // ID orqali foydalanuvchini tekshirish
    const user = await this.usersRepository.findOne({ where: { id } });

    // Agar foydalanuvchi topilmasa, xato qaytarish
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }


  async findAllByRole(role: UserRole) {
    if (role) {
      return await this.usersRepository.find({ where: { role } });
    }
    return await this.usersRepository.find();
  }
  // Faqat mentorlarni olish
  async findAllMentors() {
    return this.usersRepository.find({ where: { role: UserRole.MENTOR } });
  }

  // find mentors by id
  async findMentorById(id: number) {
    return this.usersRepository.findOne({ where: { id, role: UserRole.MENTOR } });
  }

}
