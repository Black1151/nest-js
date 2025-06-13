import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeBuilderPageClient } from '../ThemeBuilderPageClient';
import { useLazyQuery } from '@apollo/client';

jest.mock('@apollo/client');

let collectionProps: any = null;
let paletteProps: any = null;
let availableProps: any = null;
let groupProps: any = null;
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

jest.mock('../components/AvailableElements', () => ({ onSelect, selectedType }: any) => {
  availableProps = { onSelect, selectedType };
  return (
    <button data-testid="available" onClick={() => onSelect('text')}>
      available
    </button>
  );
});

jest.mock('../components/StyleGroupManagement', () => (props: any) => {
  groupProps = props;
  return (
    <button data-testid="group" onClick={() => props.onSelectGroup(2)}>
      group
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
    collectionProps = null;
    paletteProps = null;
    availableProps = null;
    groupProps = null;
    styledPaletteProps = null;
    basePaletteProps = null;
    canvasProps = null;
  });

  it('updates state based on child callbacks', async () => {
    render(<ThemeBuilderPageClient />);
    expect(paletteProps.collectionId).toBeNull();
    expect(typeof paletteProps.onSelectPalette).toBe('function');
    expect(groupProps.collectionId).toBeNull();
    expect(groupProps.elementType).toBeNull();
    await userEvent.click(screen.getByTestId('collection'));
    expect(paletteProps.collectionId).toBe(1);
    expect(groupProps.collectionId).toBe(1);
    await userEvent.click(screen.getByTestId('available'));
    expect(groupProps.elementType).toBe('text');
    await userEvent.click(screen.getByTestId('group'));
    expect(styledPaletteProps.items).toEqual([]);
    expect(basePaletteProps.items.length).toBeGreaterThan(0);
    paletteProps.onSelectPalette(3);
    expect(canvasProps.paletteId).toBe(3);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });
});
