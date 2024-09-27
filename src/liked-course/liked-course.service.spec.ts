import { Test, TestingModule } from '@nestjs/testing';
import { LikedCourseService } from './liked-course.service';

describe('LikedCourseService', () => {
  let service: LikedCourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikedCourseService],
    }).compile();

    service = module.get<LikedCourseService>(LikedCourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
