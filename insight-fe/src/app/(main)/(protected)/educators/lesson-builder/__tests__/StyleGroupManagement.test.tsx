import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StyleGroupManagement from '../components/StyleGroupManagement';
import { useQuery, useMutation } from '@apollo/client';

jest.mock('@apollo/client');

let dropdownProps: any = null;
jest.mock('@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown', () => (props: any) => {
  dropdownProps = props;
  return <select data-testid="crud" value={props.value} onChange={e => props.onChange(e)}></select>;
});

jest.mock('@/components/lesson/modals/AddStyleGroupModal', () => () => <div data-testid="group-modal" />);
jest.mock('@/components/modals/ConfirmationModal', () => () => <div data-testid="confirm-modal" />);

describe('StyleGroupManagement', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({ data: { getAllStyleGroup: [ { id: '1', name: 'Group 1' } ] }, refetch: jest.fn() });
    (useMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: false }]);
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
    await userEvent.selectOptions(screen.getByTestId('crud'), ['1']);
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
