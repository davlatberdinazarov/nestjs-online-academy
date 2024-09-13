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
  ) {}

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
    const user = await this.findOne(id);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Adminlarning faqat `MENTOR` va boshqa `ADMIN` foydalanuvchilarni yangilashga ruxsati bor
    if (currentUserRole === UserRole.STUDENT) {
      throw new ForbiddenException('Students cannot update other users');
    }
  
    // Admin foydalanuvchi boshqa admin yoki mentorni yangilay oladi
    if (currentUserRole === UserRole.ADMIN && user.role === UserRole.STUDENT) {
      throw new ForbiddenException('Cannot update student users');
    }
  
    // Rolni tekshirib yangilash
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }
  
  async delete(id: number, currentUserRole: UserRole) {
    const user = await this.findOne(id);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }
  
    // Admin foydalanuvchi boshqa admin yoki mentorni o'chirishi mumkin
    // if (currentUserRole === UserRole.ADMIN && user.role === UserRole.STUDENT) {
    //   throw new ForbiddenException('Cannot delete student users');
    // }
  
    await this.usersRepository.delete(id);
    return { deleted: true };
  }
  

  // ID bo'yicha foydalanuvchini topish
  async findOne(id: number) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findAllByRole(role: UserRole) {
    if (role) {
      return await this.usersRepository.find({ where: { role } });
    }
    return await this.usersRepository.find();
  }
  
}
