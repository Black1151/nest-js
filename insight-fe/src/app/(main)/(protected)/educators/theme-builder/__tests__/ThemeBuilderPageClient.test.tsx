import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeBuilderPageClient } from '../ThemeBuilderPageClient';

let collectionProps: any = null;
let paletteProps: any = null;
let availableProps: any = null;
let groupProps: any = null;

jest.mock('../components/StyleCollectionManagement', () => (props: any) => {
  collectionProps = props;
  return <button data-testid="collection" onClick={() => props.onSelectCollection(1)}>collection</button>;
});

jest.mock('../components/ColorPaletteManagement', () => (props: any) => {
  paletteProps = props;
  return <div data-testid="palette" />;
});

jest.mock('../components/AvailableElements', () => ({ onSelect, selectedType }: any) => {
  availableProps = { onSelect, selectedType };
  return <button data-testid="available" onClick={() => onSelect('text')}>available</button>;
});

jest.mock('../components/StyleGroupManagement', () => (props: any) => {
  groupProps = props;
  return <div data-testid="group" />;
});

describe('ThemeBuilderPageClient', () => {
  it('updates state based on child callbacks', async () => {
    render(<ThemeBuilderPageClient />);
    expect(paletteProps.collectionId).toBeNull();
    expect(groupProps.collectionId).toBeNull();
    expect(groupProps.elementType).toBeNull();
    // select collection
    await userEvent.click(screen.getByTestId('collection'));
    expect(paletteProps.collectionId).toBe(1);
    expect(groupProps.collectionId).toBe(1);
    // select element
    await userEvent.click(screen.getByTestId('available'));
    expect(groupProps.elementType).toBe('text');
  });
});
