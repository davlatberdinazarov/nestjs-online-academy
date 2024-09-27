import { Test, TestingModule } from '@nestjs/testing';
import { LikedCourseController } from './liked-course.controller';
import { LikedCourseService } from './liked-course.service';

describe('LikedCourseController', () => {
  let controller: LikedCourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikedCourseController],
      providers: [LikedCourseService],
    }).compile();

    controller = module.get<LikedCourseController>(LikedCourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
