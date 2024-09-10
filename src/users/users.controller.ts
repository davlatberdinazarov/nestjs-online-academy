import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Foydalanuvchini yaratish
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Barcha foydalanuvchilarni olish
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // ID bo'yicha bitta foydalanuvchini olish
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  // Foydalanuvchini yangilash
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: CreateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
