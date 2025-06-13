import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorPaletteManagement from '../components/ColorPaletteManagement';
import { useQuery, useMutation } from '@apollo/client';

jest.mock('@apollo/client');

let dropdownProps: any = null;
jest.mock('@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown', () => (props: any) => {
  dropdownProps = props;
  return <select data-testid="crud" value={props.value} onChange={e => props.onChange(e)}></select>;
});

jest.mock('@/components/lesson/modals/AddColorPaletteModal', () => () => <div data-testid="add-modal" />);
jest.mock('@/components/modals/ConfirmationModal', () => () => <div data-testid="confirm-modal" />);

describe('ColorPaletteManagement', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({ data: { getAllColorPalette: [ { id: '1', name: 'Palette 1', colors: [] } ] }, refetch: jest.fn() });
    (useMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: false }]);
    dropdownProps = null;
  });

  it('provides palettes as options', () => {
    render(<ColorPaletteManagement collectionId={1} />);
    expect(dropdownProps.options).toEqual([{ label: 'Palette 1', value: '1' }]);
  });

  it('clears selection when collection changes', async () => {
    const { rerender } = render(<ColorPaletteManagement collectionId={1} />);
    await userEvent.selectOptions(screen.getByTestId('crud'), ['1']);
    expect(dropdownProps.value).toBe(1);
    rerender(<ColorPaletteManagement collectionId={2} />);
    expect(dropdownProps.value).toBe('');
  });
});
