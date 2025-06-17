import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeBuilderPageClient } from '../ThemeBuilderPageClient';
import { useLazyQuery, useQuery } from '@apollo/client';

jest.mock('@apollo/client');

let collectionProps: any = null;
let paletteProps: any = null;
let availableProps: any = null;
let styledPaletteProps: any = null;
let basePaletteProps: any = null;
let canvasProps: any = null;

jest.mock('../components/ThemeCanvas', () => (props: any) => {
  canvasProps = props;
  return <div data-testid="canvas" />;
});

jest.mock('../components/StyleCollectionManagement', () => (props: any) => {
  collectionProps = props;
  return (
    <button data-testid="collection" onClick={() => props.onSelectCollection(1)}>
      collection
    </button>
  );
});

jest.mock('../components/ColorPaletteManagement', () => (props: any) => {
  paletteProps = props;
  return <div data-testid="palette" />;
});

jest.mock('@/components/modals/ConfirmationModal', () => (props: any) => {
  return <div data-testid="confirm" {...props} />;
});

jest.mock('../components/AvailableElements', () => ({ onSelect, selectedType }: any) => {
  availableProps = { onSelect, selectedType };
  return (
    <button data-testid="available" onClick={() => onSelect('text')}>
      available
    </button>
  );
});


jest.mock('@/components/DnD/DnDPalette', () => (props: any) => {
  if (props.testId === 'styled') {
    styledPaletteProps = props;
    return <div data-testid="styled" />;
  }
  if (props.testId === 'base') {
    basePaletteProps = props;
    return <div data-testid="base" />;
  }
  return null;
});

describe('ThemeBuilderPageClient', () => {
  beforeEach(() => {
    (useLazyQuery as jest.Mock).mockReturnValue([jest.fn(), { data: { getAllStyle: [] } }]);
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        getAllTheme: [],
      },
    });
    collectionProps = null;
    paletteProps = null;
    availableProps = null;
    styledPaletteProps = null;
    basePaletteProps = null;
    canvasProps = null;
  });

  it('updates state based on child callbacks', async () => {
    render(<ThemeBuilderPageClient />);
    expect(paletteProps.collectionId).toBeNull();
    expect(typeof paletteProps.onSelectPalette).toBe('function');
    await userEvent.click(screen.getByTestId('collection'));
    expect(paletteProps.collectionId).toBe(1);
    await userEvent.click(screen.getByTestId('available'));
    expect(styledPaletteProps.items.length).toBeGreaterThan(0);
    expect(basePaletteProps.items.length).toBeGreaterThan(0);
    paletteProps.onSelectPalette(3);
    expect(canvasProps.paletteId).toBe(3);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('shows the loaded theme name', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        getAllTheme: [
          { id: 1, name: 'Loaded', styleCollectionId: 1, defaultPaletteId: 2 },
        ],
      },
    });

    render(<ThemeBuilderPageClient />);
    await userEvent.click(screen.getByText('Load Theme'));
    await userEvent.selectOptions(
      screen.getByLabelText('Select Theme'),
      '1'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Load' }));

    expect(screen.getByTestId('theme-name')).toHaveTextContent('Loaded');
  });

  it('shows confirm modal when saving a loaded theme', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        getAllTheme: [
          { id: 1, name: 'Loaded', styleCollectionId: 1, defaultPaletteId: 2 },
        ],
      },
    });

    render(<ThemeBuilderPageClient />);
    await userEvent.click(screen.getByText('Load Theme'));
    await userEvent.selectOptions(
      screen.getByLabelText('Select Theme'),
      '1'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Load' }));
    await userEvent.click(screen.getByText('Save Theme'));

    expect(screen.getByTestId('confirm')).toBeInTheDocument();
  });
});
