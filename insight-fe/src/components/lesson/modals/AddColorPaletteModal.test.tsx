import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import AddColorPaletteModal from './AddColorPaletteModal';

describe('AddColorPaletteModal', () => {
  it('updates palette name when typing', () => {
    render(
      <ChakraProvider>
        <AddColorPaletteModal isOpen={true} onClose={() => {}} collectionId={1} />
      </ChakraProvider>
    );
    const input = screen.getByPlaceholderText('Palette name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'My Palette' } });
    expect(input.value).toBe('My Palette');
  });
});
