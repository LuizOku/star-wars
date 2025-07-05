import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '../../app/page';

// Mock fetch globally
global.fetch = jest.fn();

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/'),
}));

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the homepage with all components', () => {
    render(<HomePage />);

    expect(screen.getByText('SWStarter')).toBeInTheDocument();
    expect(screen.getByText('What are you searching for?')).toBeInTheDocument();
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows empty state initially', () => {
    render(<HomePage />);

    expect(screen.getByText('There are zero matches.')).toBeInTheDocument();
    expect(screen.getByText('Use the form to search for People or Movies.')).toBeInTheDocument();
  });

  it('performs successful people search', async () => {
    const user = userEvent.setup();
    const mockResults = {
      result: [
        { uid: '1', name: 'Luke Skywalker' },
        { uid: '2', name: 'Darth Vader' },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResults),
    } as unknown as Response);

    render(<HomePage />);

    // Enter search query
    const searchInput = screen.getByRole('textbox');
    await user.type(searchInput, 'Luke');

    // Click search button
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      expect(screen.getByText('Darth Vader')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/search?query=Luke&type=people');
  });

  it('performs successful movies search', async () => {
    const user = userEvent.setup();
    const mockResults = {
      result: [
        { uid: '1', name: 'A New Hope' },
        { uid: '2', name: 'Empire Strikes Back' },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResults),
    } as unknown as Response);

    render(<HomePage />);

    // Switch to movies
    const moviesRadio = screen.getByLabelText('Movies');
    await user.click(moviesRadio);

    // Enter search query
    const searchInput = screen.getByRole('textbox');
    await user.type(searchInput, 'Hope');

    // Click search button
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('A New Hope')).toBeInTheDocument();
      expect(screen.getByText('Empire Strikes Back')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/search?query=Hope&type=movies');
  });

  it('shows loading state during search', async () => {
    const user = userEvent.setup();

    // Create a promise that we can control
    let resolvePromise: (value: { result: Array<{ uid: string; name: string }> }) => void;
    const mockPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockReturnValueOnce(mockPromise),
    } as unknown as Response);

    render(<HomePage />);

    // Enter search query and submit
    const searchInput = screen.getByRole('textbox');
    await user.type(searchInput, 'Luke');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // Should show loading state
    expect(screen.getByText('SEARCHING...')).toBeInTheDocument();
    expect(screen.getByText('Searching...')).toBeInTheDocument();

    // Resolve the promise
    resolvePromise!({ result: [] });

    await waitFor(() => {
      expect(screen.queryByText('SEARCHING...')).not.toBeInTheDocument();
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    });
  });

  it('handles search errors', async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as unknown as Response);

    render(<HomePage />);

    // Enter search query and submit
    const searchInput = screen.getByRole('textbox');
    await user.type(searchInput, 'Luke');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('HTTP error! status: 500')).toBeInTheDocument();
    });

    // Results should be empty
    expect(screen.getByText('There are zero matches.')).toBeInTheDocument();
  });

  it('handles API response with no results', async () => {
    const user = userEvent.setup();
    const mockResults = { result: [] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResults),
    } as unknown as Response);

    render(<HomePage />);

    // Enter search query and submit
    const searchInput = screen.getByRole('textbox');
    await user.type(searchInput, 'NonExistent');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText('There are zero matches.')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/search?query=NonExistent&type=people');
  });

  it('handles API response with null result', async () => {
    const user = userEvent.setup();
    const mockResults = { result: null };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResults),
    } as unknown as Response);

    render(<HomePage />);

    // Enter search query and submit
    const searchInput = screen.getByRole('textbox');
    await user.type(searchInput, 'Test');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText('There are zero matches.')).toBeInTheDocument();
    });
  });

  it('does not search with empty query', async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    // Try to search with empty query
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // Fetch should not be called
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not search with whitespace-only query', async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    // Enter whitespace-only query
    const searchInput = screen.getByRole('textbox');
    await user.type(searchInput, '   ');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // Fetch should not be called
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('changes search type and clears query', async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    // Enter a query for people
    const searchInput = screen.getByRole('textbox');
    await user.type(searchInput, 'Luke');

    // Switch to movies
    const moviesRadio = screen.getByLabelText('Movies');
    await user.click(moviesRadio);

    // Query should be cleared
    expect(searchInput).toHaveValue('');

    // Placeholder should change
    expect(searchInput).toHaveAttribute('placeholder', 'e.g. A New Hope, Empire Strikes Back');
  });

  it('maintains responsive layout classes', () => {
    render(<HomePage />);

    const mainContainer = screen.getByRole('main');
    expect(mainContainer.className).toContain('container');
    expect(mainContainer.className).toContain('mx-auto');
    expect(mainContainer.className).toContain('px-4');
    expect(mainContainer.className).toContain('py-8');

    // Check for grid layout
    const gridContainer = mainContainer.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer?.className).toContain('lg:grid-cols-[40%_60%]');
  });

  it('handles multiple rapid searches', async () => {
    const user = userEvent.setup();

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ result: [{ uid: '1', name: 'Luke' }] }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ result: [{ uid: '2', name: 'Leia' }] }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ result: [{ uid: '3', name: 'Han' }] }),
      } as unknown as Response);

    render(<HomePage />);

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Perform multiple searches rapidly
    await user.type(searchInput, 'Luke');
    await user.click(searchButton);

    await user.clear(searchInput);
    await user.type(searchInput, 'Leia');
    await user.click(searchButton);

    await user.clear(searchInput);
    await user.type(searchInput, 'Han');
    await user.click(searchButton);

    // Wait for final result
    await waitFor(() => {
      expect(screen.getByText('Han')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
}); 