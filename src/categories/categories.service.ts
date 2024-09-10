import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async findAll() {
    return await this.categoriesRepository.find();
  }

  async findOne(id: number) {
    // Correctly finding a category by ID using 'where'
    return await this.categoriesRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // Correct way to find a category by ID using 'where'
    const category = await this.categoriesRepository.findOne({ where: { id } });
    
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
  
    // Update the category object with new data
    Object.assign(category, updateCategoryDto);
  
    // Save the updated category back to the repository
    return await this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return await this.categoriesRepository.remove(category);
  }
}
