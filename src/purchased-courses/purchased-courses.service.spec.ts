import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedCoursesService } from './purchased-courses.service';

describe('PurchasedCoursesService', () => {
  let service: PurchasedCoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasedCoursesService],
    }).compile();

    service = module.get<PurchasedCoursesService>(PurchasedCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
