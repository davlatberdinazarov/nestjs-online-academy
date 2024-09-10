import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Foydalanuvchi yaratish (ro'yxatdan o'tkazish)
  async create(createUserDto: CreateUserDto) {
    const { username, password, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10); // Parolni xesh qilish
    console.log(hashedPassword);
    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      role,
    });
    return await this.usersRepository.save(newUser);
  }

  // Barcha foydalanuvchilarni olish
  async findAll() {
    return await this.usersRepository.find();
  }

  // ID bo'yicha foydalanuvchini topish (to'g'ri findOne foydalanish)
  async findOne(id: number) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  // Username orqali foydalanuvchini topish
  async findOneByUsername(username: string) {
    return await this.usersRepository.findOne({ where: { username } });
  }

  // Foydalanuvchini yangilash
  async update(id: number, updateUserDto: CreateUserDto) {
    const user = await this.findOne(id);
    if (user) {
      Object.assign(user, updateUserDto);
      return await this.usersRepository.save(user);
    }
    return null;
  }
}
