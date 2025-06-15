import { render } from '@testing-library/react';
import StyleCollectionManagement from '../components/StyleCollectionManagement';
import { useQuery, useMutation } from '@apollo/client';

jest.mock('@apollo/client');

let dropdownProps: any = null;
jest.mock('@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown', () => (props: any) => {
  dropdownProps = props;
  return <select data-testid="crud" value={props.value} onChange={e => props.onChange(e)}></select>;
});

jest.mock('@/components/lesson/modals/AddStyleCollectionModal', () => () => <div data-testid="collection-modal" />);
jest.mock('@/components/modals/ConfirmationModal', () => () => <div data-testid="confirm-modal" />);

describe('StyleCollectionManagement', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({ data: { getAllStyleCollection: [ { id: '1', name: 'Collection 1' } ] }, refetch: jest.fn() });
    (useMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: false }]);
    dropdownProps = null;
  });

  it('provides collections as options', () => {
    render(<StyleCollectionManagement onSelectCollection={() => {}} />);
    expect(dropdownProps.options).toEqual([{ label: 'Collection 1', value: '1' }]);
  });
});
