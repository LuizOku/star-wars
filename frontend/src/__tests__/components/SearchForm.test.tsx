import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from '../../components/SearchForm';
import { SearchType } from '@/app/page';

describe('SearchForm', () => {
  const mockProps = {
    query: '',
    setQuery: jest.fn(),
    onSearch: jest.fn(),
    loading: false,
    error: null,
    searchType: 'people' as SearchType,
    setSearchType: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search form with correct elements', () => {
    render(<SearchForm {...mockProps} />);

    expect(screen.getByText('What are you searching for?')).toBeInTheDocument();
    expect(screen.getByLabelText('People')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays correct placeholder for people search', () => {
    render(<SearchForm {...mockProps} searchType="people" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'e.g. Chewbacca, Yoda, Boba Fett');
  });

  it('displays correct placeholder for movies search', () => {
    render(<SearchForm {...mockProps} searchType="movies" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'e.g. A New Hope, Empire Strikes Back');
  });

  it('calls setQuery when input value changes', async () => {
    const user = userEvent.setup();
    render(<SearchForm {...mockProps} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Luke');

    await waitFor(() => {
      expect(mockProps.setQuery).toHaveBeenCalledTimes(4);
      expect(mockProps.setQuery).toHaveBeenLastCalledWith('e');
    });
  });

  it('calls onSearch when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchForm {...mockProps} query="Luke" />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockProps.onSearch).toHaveBeenCalledTimes(1);
  });

  it('disables search button when loading', () => {
    render(<SearchForm {...mockProps} loading={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('disables search button when query is empty', () => {
    render(<SearchForm {...mockProps} query="" />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('enables search button when query is not empty and not loading', () => {
    render(<SearchForm {...mockProps} query="Luke" loading={false} />);

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('displays loading text when loading', () => {
    render(<SearchForm {...mockProps} loading={true} />);

    expect(screen.getByText('SEARCHING...')).toBeInTheDocument();
  });

  it('displays search text when not loading', () => {
    render(<SearchForm {...mockProps} loading={false} />);

    expect(screen.getByText('SEARCH')).toBeInTheDocument();
  });

  it('displays error message when error is present', () => {
    const errorMessage = 'Something went wrong';
    render(<SearchForm {...mockProps} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('does not display error message when error is null', () => {
    render(<SearchForm {...mockProps} error={null} />);

    const errorElements = screen.queryAllByText(/error/i);
    expect(errorElements).toHaveLength(0);
  });

  it('calls setSearchType and setQuery when search type changes', async () => {
    const user = userEvent.setup();
    render(<SearchForm {...mockProps} searchType="people" />);

    const movieRadio = screen.getByLabelText('Movies');
    await user.click(movieRadio);

    expect(mockProps.setSearchType).toHaveBeenCalledWith('movies');
    expect(mockProps.setQuery).toHaveBeenCalledWith('');
  });

  it('shows the correct radio button as selected', () => {
    render(<SearchForm {...mockProps} searchType="people" />);

    const peopleRadio = screen.getByLabelText('People');
    const moviesRadio = screen.getByLabelText('Movies');

    expect(peopleRadio).toBeChecked();
    expect(moviesRadio).not.toBeChecked();
  });

  it('updates placeholder when search type changes', () => {
    const { rerender } = render(<SearchForm {...mockProps} searchType="people" />);

    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'e.g. Chewbacca, Yoda, Boba Fett');

    rerender(<SearchForm {...mockProps} searchType="movies" />);

    input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'e.g. A New Hope, Empire Strikes Back');
  });

  it('handles keyboard events correctly', async () => {
    const user = userEvent.setup();
    render(<SearchForm {...mockProps} query="Luke" />);

    const input = screen.getByRole('textbox');
    await user.type(input, '{enter}');

    // Note: The component doesn't handle enter key, but we test that it doesn't break
    expect(mockProps.onSearch).not.toHaveBeenCalled();
  });
}); 