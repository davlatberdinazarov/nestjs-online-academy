import { Test, TestingModule } from '@nestjs/testing';
import { LessonGroupController } from './lesson-group.controller';
import { LessonGroupService } from './lesson-group.service';

describe('LessonGroupController', () => {
  let controller: LessonGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonGroupController],
      providers: [LessonGroupService],
    }).compile();

    controller = module.get<LessonGroupController>(LessonGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
