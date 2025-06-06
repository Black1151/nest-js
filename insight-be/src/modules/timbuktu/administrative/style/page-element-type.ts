import { registerEnumType } from '@nestjs/graphql';

export enum PageElementType {
  Text = 'text',
  Table = 'table',
  Image = 'image',
  Video = 'video',
  Quiz = 'quiz',
}

registerEnumType(PageElementType, { name: 'PageElementType' });
