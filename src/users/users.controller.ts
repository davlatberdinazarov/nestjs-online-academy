import { Controller, Post, Body, Get, Param, Patch, Req, UseGuards, ForbiddenException, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Foydalanuvchini yaratish
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, UserRole.STUDENT); // Default rol
  }

  // Mentor yaratish (faqat adminlar)
  @Post('create-mentor')
  @UseGuards(AuthGuard('jwt'))
  async createMentor(@Body() createUserDto: CreateUserDto, @Req() req: RequestWithUser) {
    const currentUser = req.user;

    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create mentor users');
    }

    // Adminlar uchun role ni kiritish shart emas, default rolni `MENTOR` qilib o'rnatish
    return this.usersService.create(createUserDto, UserRole.ADMIN);
  }

  // Admin yaratish (faqat adminlar)
  @Post('create-admin')
  @UseGuards(AuthGuard('jwt'))
  async createAdmin(@Body() createUserDto: CreateUserDto, @Req() req: RequestWithUser) {
    const currentUser = req.user;

    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create other admin users');
    }

    // Adminlar uchun role ni kiritish shart emas, default rolni `ADMIN` qilib o'rnatish
    return this.usersService.create(createUserDto, UserRole.ADMIN);
  }
  // Barcha foydalanuvchilarni olish
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return this.usersService.findAll();
  }

    // Rolga qarab foydalanuvchilarni olish
    @Get('role/:role')
    @UseGuards(AuthGuard('jwt'))
    async findAllByRole(@Param('role') role: UserRole, @Req() req: RequestWithUser) {
      const currentUser = req.user;
      // Admin rolidagi foydalanuvchilar har qanday rolni ko'rishi mumkin
      if (currentUser.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Only admins can view users by role');
      }
  
      return this.usersService.findAllByRole(role);
    }

  // ID bo'yicha foydalanuvchini olish
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: CreateUserDto,
    @Req() req: RequestWithUser
  ) {
    const currentUser = req.user;
    return this.usersService.update(id, updateUserDto, currentUser.role);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: number, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.usersService.delete(id, currentUser.role);
  }
}
