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

  it('updates color token name and value', () => {
    render(
      <ChakraProvider>
        <AddColorPaletteModal isOpen={true} onClose={() => {}} collectionId={1} />
      </ChakraProvider>
    );

    const nameInput = screen.getByPlaceholderText('Token name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'primary' } });
    expect(nameInput.value).toBe('primary');

    const colorInput = screen.getByDisplayValue('#000000') as HTMLInputElement;
    fireEvent.change(colorInput, { target: { value: '#ff0000' } });
    expect(colorInput.value).toBe('#ff0000');
  });
});
