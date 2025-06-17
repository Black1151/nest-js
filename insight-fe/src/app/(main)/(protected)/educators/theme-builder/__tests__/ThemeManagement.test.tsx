import { render } from '@testing-library/react';
import ThemeManagement from '../components/ThemeManagement';
import { useQuery, useMutation } from '@apollo/client';

jest.mock('@apollo/client');

let dropdownProps: any = null;
jest.mock('@/app/(main)/(protected)/administration/coordination-panel/_components/dropdowns/CrudDropdown', () => (props: any) => {
  dropdownProps = props;
  return <select data-testid="crud" value={props.value} onChange={e => props.onChange(e)}></select>;
});

jest.mock('@/components/lesson/modals/AddThemeModal', () => () => <div data-testid="theme-modal" />);
jest.mock('@/components/modals/ConfirmationModal', () => () => <div data-testid="confirm-modal" />);

describe('ThemeManagement', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({ data: { getAllTheme: [ { id: '1', name: 'Theme 1' } ] }, refetch: jest.fn() });
    (useMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: false }]);
    dropdownProps = null;
  });

  it('provides themes as options', () => {
    render(<ThemeManagement />);
    expect(dropdownProps.options).toEqual([{ label: 'Theme 1', value: '1' }]);
  });
});
