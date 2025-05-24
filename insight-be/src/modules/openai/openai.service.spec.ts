import { OpenAiService } from './openai.service';

describe('OpenAiService', () => {
  let service: OpenAiService;

  beforeEach(() => {
    service = new OpenAiService();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          { message: { content: JSON.stringify({ title: 't', description: 'd', content: {} }) } },
        ],
      }),
    }) as any;
  });

  it('calls fetch and parses response', async () => {
    const lesson = await service.generateLesson('prompt');
    expect(fetch).toHaveBeenCalled();
    expect(lesson.title).toBe('t');
  });
});
