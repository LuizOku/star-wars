import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import ResultsList from '../../components/ResultsList';
import { SearchResult } from '@/shared/interfaces/search';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

jest.mocked(useRouter).mockReturnValue(mockRouter as unknown as AppRouterInstance);

describe('ResultsList', () => {
  const mockResults: SearchResult[] = [
    { uid: '1', name: 'Luke Skywalker' },
    { uid: '2', name: 'Darth Vader' },
    { uid: '3', name: 'Princess Leia' },
  ];

  const mockProps = {
    results: mockResults,
    loading: false,
    searchType: 'people' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the results list with correct title', () => {
    render(<ResultsList {...mockProps} />);

    expect(screen.getByText('Results')).toBeInTheDocument();
  });

  it('displays loading state correctly', () => {
    render(<ResultsList {...mockProps} loading={true} />);

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('displays empty state when no results and not loading', () => {
    render(<ResultsList {...mockProps} results={[]} loading={false} />);

    expect(screen.getByText('There are zero matches.')).toBeInTheDocument();
    expect(screen.getByText('Use the form to search for People or Movies.')).toBeInTheDocument();
  });

  it('does not display empty state when loading', () => {
    render(<ResultsList {...mockProps} results={[]} loading={true} />);

    expect(screen.queryByText('There are zero matches.')).not.toBeInTheDocument();
    expect(screen.queryByText('Use the form to search for People or Movies.')).not.toBeInTheDocument();
  });

  it('renders all results when present', () => {
    render(<ResultsList {...mockProps} />);

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Darth Vader')).toBeInTheDocument();
    expect(screen.getByText('Princess Leia')).toBeInTheDocument();
  });

  it('renders see details button for each result', () => {
    render(<ResultsList {...mockProps} />);

    const seeDetailsButtons = screen.getAllByText('SEE DETAILS');
    expect(seeDetailsButtons).toHaveLength(3);
  });

  it('navigates to people detail page when see details is clicked for people search', async () => {
    const user = userEvent.setup();
    render(<ResultsList {...mockProps} searchType="people" />);

    const firstSeeDetailsButton = screen.getAllByText('SEE DETAILS')[0];
    await user.click(firstSeeDetailsButton);

    expect(mockPush).toHaveBeenCalledWith('/people/1');
  });

  it('navigates to movies detail page when see details is clicked for movies search', async () => {
    const user = userEvent.setup();
    render(<ResultsList {...mockProps} searchType="movies" />);

    const firstSeeDetailsButton = screen.getAllByText('SEE DETAILS')[0];
    await user.click(firstSeeDetailsButton);

    expect(mockPush).toHaveBeenCalledWith('/movies/1');
  });

  it('handles multiple see details button clicks correctly', async () => {
    const user = userEvent.setup();
    render(<ResultsList {...mockProps} searchType="people" />);

    const seeDetailsButtons = screen.getAllByText('SEE DETAILS');

    await user.click(seeDetailsButtons[0]);
    await user.click(seeDetailsButtons[1]);
    await user.click(seeDetailsButtons[2]);

    expect(mockPush).toHaveBeenCalledTimes(3);
    expect(mockPush).toHaveBeenNthCalledWith(1, '/people/1');
    expect(mockPush).toHaveBeenNthCalledWith(2, '/people/2');
    expect(mockPush).toHaveBeenNthCalledWith(3, '/people/3');
  });

  it('does not render results list when loading', () => {
    render(<ResultsList {...mockProps} loading={true} />);

    expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument();
    expect(screen.queryByText('SEE DETAILS')).not.toBeInTheDocument();
  });

  it('renders correct number of list items', () => {
    render(<ResultsList {...mockProps} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('handles empty results array', () => {
    render(<ResultsList {...mockProps} results={[]} loading={false} />);

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  it('handles single result correctly', () => {
    const singleResult: SearchResult[] = [{ uid: '1', name: 'Luke Skywalker' }];
    render(<ResultsList {...mockProps} results={singleResult} />);

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getAllByText('SEE DETAILS')).toHaveLength(1);
  });

  it('maintains correct UI structure', () => {
    render(<ResultsList {...mockProps} />);

    // Check that the main container exists
    const container = screen.getByText('Results').closest('div');
    expect(container).toBeInTheDocument();
    expect(container?.className).toContain('w-full');
    expect(container?.className).toContain('bg-white');
    expect(container?.className).toContain('p-6');
    expect(container?.className).toContain('rounded-lg');
    expect(container?.className).toContain('shadow');

    // Check that the results list exists
    const resultsList = screen.getByRole('list');
    expect(resultsList).toBeInTheDocument();
  });

  it('handles results with special characters in names', () => {
    const specialResults: SearchResult[] = [
      { uid: '1', name: 'C-3PO' },
      { uid: '2', name: 'R2-D2' },
      { uid: '3', name: 'Boba Fett (Clone)' },
    ];

    render(<ResultsList {...mockProps} results={specialResults} />);

    expect(screen.getByText('C-3PO')).toBeInTheDocument();
    expect(screen.getByText('R2-D2')).toBeInTheDocument();
    expect(screen.getByText('Boba Fett (Clone)')).toBeInTheDocument();
  });
}); 