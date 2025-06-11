import React from 'react';
import { render, screen } from '@testing-library/react';
import SlideElementRenderer from './SlideElementRenderer';
import { SlideElementDnDItemProps } from '@/components/DnD/cards/SlideElementDnDCard';
import { ComponentVariant } from '@/theme/helpers';

describe('SlideElementRenderer', () => {
  it('applies accessible label from variant', () => {
    const item: SlideElementDnDItemProps = {
      id: '1',
      type: 'text',
      text: 'Hello',
      variantId: 1,
    } as any;

    const variants: ComponentVariant[] = [
      {
        id: 1,
        baseComponent: 'Text',
        accessibleName: 'Greeting text',
        props: {},
      },
    ];

    render(<SlideElementRenderer item={item} variants={variants} />);

    expect(screen.getByLabelText('Greeting text')).toBeInTheDocument();
  });
});
