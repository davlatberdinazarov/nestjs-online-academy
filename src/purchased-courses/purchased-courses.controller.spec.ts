import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedCoursesController } from './purchased-courses.controller';
import { PurchasedCoursesService } from './purchased-courses.service';

describe('PurchasedCoursesController', () => {
  let controller: PurchasedCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasedCoursesController],
      providers: [PurchasedCoursesService],
    }).compile();

    controller = module.get<PurchasedCoursesController>(PurchasedCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
