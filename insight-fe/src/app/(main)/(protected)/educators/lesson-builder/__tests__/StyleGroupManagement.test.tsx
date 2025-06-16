import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StyleGroupManagement from '../components/StyleGroupManagement';
import { useQuery } from '@apollo/client';

jest.mock('@apollo/client');

let dropdownProps: any = null;
jest.mock('@/components/dropdowns/SimpleDropdown', () => (props: any) => {
  dropdownProps = props;
  return <select data-testid="simple" value={props.value} onChange={e => props.onChange(e)}></select>;
});


describe('StyleGroupManagement', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({ data: { getAllStyleGroup: [ { id: '1', name: 'Group 1' } ] }, refetch: jest.fn() });
    dropdownProps = null;
  });

  it('provides groups as options', () => {
    render(<StyleGroupManagement collectionId={1} elementType="text" />);
    expect(dropdownProps.options).toEqual([{ label: 'Group 1', value: '1' }]);
  });

  it('calls onSelectGroup when a group is selected', async () => {
    const onSelect = jest.fn();
    render(
      <StyleGroupManagement
        collectionId={1}
        elementType="text"
        onSelectGroup={onSelect}
      />
    );
    await userEvent.selectOptions(screen.getByTestId('simple'), ['1']);
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
