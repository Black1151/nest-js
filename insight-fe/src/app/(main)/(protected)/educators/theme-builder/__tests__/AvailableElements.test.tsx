import { render, screen, fireEvent } from '@testing-library/react';
import { AvailableElements } from '../components/AvailableElements';

describe('AvailableElements', () => {
  it('renders all element buttons', () => {
    render(<AvailableElements selectedType={null} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: 'Text' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Table' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Image' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Video' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quiz' })).toBeInTheDocument();
  });

  it('calls onSelect when clicking a button', () => {
    const onSelect = jest.fn();
    render(<AvailableElements selectedType={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Text' }));
    expect(onSelect).toHaveBeenCalledWith('text');
  });
});
