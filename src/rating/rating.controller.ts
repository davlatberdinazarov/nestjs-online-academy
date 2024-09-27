import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/users/interfaces/request-with-user.interface';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('create-rating')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createRatingDto: CreateRatingDto, @Req() req: RequestWithUser) {
    return await this.ratingService.create(createRatingDto, req.user.id); // Token orqali userId ni qo'shish
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async update(
      @Param('id') id: string,
      @Body() updateRatingDto: UpdateRatingDto,
      @Req() req: RequestWithUser,
  ) {
      return await this.ratingService.update(+id, updateRatingDto, req.user.id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Faqat adminlar o'chirishi mumkin
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.ratingService.remove(+id, req.user.id);
  }

  @Get('all')
  async findAll() {
    return await this.ratingService.findAll();
  }

  @Get('find-one/:id')
  async findOne(@Param('id') id: string) {
    return await this.ratingService.findOne(+id);
  }
}
