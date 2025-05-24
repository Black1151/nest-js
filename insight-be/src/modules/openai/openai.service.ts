import { Injectable } from '@nestjs/common';
import { GeneratedLesson } from './openai.types';

@Injectable()
export class OpenAiService {
  private readonly apiKey = process.env.OPENAI_API_KEY ?? '';

  async generateLesson(prompt: string): Promise<GeneratedLesson> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI request failed with status ${res.status}`);
    }

    const data = await res.json();
    const message = data.choices?.[0]?.message?.content ?? '{}';
    try {
      return JSON.parse(message) as GeneratedLesson;
    } catch {
      return { title: 'Untitled Lesson', description: message, content: null };
    }
  }
}
