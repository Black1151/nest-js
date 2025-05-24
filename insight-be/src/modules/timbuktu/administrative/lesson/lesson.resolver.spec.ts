import { Test, TestingModule } from '@nestjs/testing';
import { LessonResolver } from './lesson.resolver';
import { LessonService } from './lesson.service';
import { OpenAiService } from '../../../openai/openai.service';

describe('LessonResolver generateLessonFromPrompt', () => {
  let resolver: LessonResolver;
  let openAi: OpenAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonResolver,
        { provide: LessonService, useValue: {} },
        {
          provide: OpenAiService,
          useValue: { generateLesson: jest.fn().mockResolvedValue({ title: 'ai' }) },
        },
      ],
    }).compile();

    resolver = module.get<LessonResolver>(LessonResolver);
    openAi = module.get<OpenAiService>(OpenAiService);
  });

  it('returns generated lesson', async () => {
    const result = await resolver.generateLessonFromPrompt('hi');
    expect(openAi.generateLesson).toHaveBeenCalledWith('hi');
    expect(result).toEqual({ title: 'ai' });
  });
});
