import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ElementWrapper from './ElementWrapper';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('ElementWrapper background', () => {
  it('renders hex background with opacity', () => {
    renderWithChakra(
      <ElementWrapper
        data-testid="wrapper"
        styles={{ bgColor: '#ff0000', bgOpacity: 0.5 }}
      >
        Test
      </ElementWrapper>
    );
    expect(screen.getByTestId('wrapper')).toHaveStyle(
      'background: rgba(255, 0, 0, 0.5)'
    );
  });

  it('renders token background with opacity', () => {
    renderWithChakra(
      <ElementWrapper
        data-testid="wrapper"
        styles={{ bgColor: 'red.500', bgOpacity: 0.5 }}
      >
        Test
      </ElementWrapper>
    );
    expect(screen.getByTestId('wrapper')).toHaveStyle(
      'background: rgba(var(--chakra-colors-red-500), 0.5)'
    );
  });
});
