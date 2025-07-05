import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams, useRouter } from 'next/navigation';
import MovieDetailPage from '../../app/movies/[uid]/page';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock Next.js router
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('MovieDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    mockUseRouter.mockReturnValue(mockRouter as never);
  });

  const mockMovieData = {
    message: 'ok',
    result: {
      uid: '1',
      properties: {
        title: 'A New Hope',
        episode_id: 4,
        opening_crawl: 'It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.',
        director: 'George Lucas',
        producer: 'Gary Kurtz, Rick McCallum',
        release_date: '1977-05-25',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
      },
      description: 'A New Hope',
    },
    characters: [
      { uid: '1', name: 'Luke Skywalker' },
      { uid: '2', name: 'Princess Leia' },
      { uid: '3', name: 'Han Solo' },
    ],
  };

  it('shows loading state initially', () => {
    mockUseParams.mockReturnValue({ uid: '1' });

    render(<MovieDetailPage />);

    // Should show loading skeleton
    expect(screen.getByText('SWStarter')).toBeInTheDocument();

    // Check for loading skeleton elements
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders movie details successfully', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockMovieData),
    } as any);

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('A New Hope')).toBeInTheDocument();
    });

    expect(screen.getByText('Opening Crawl')).toBeInTheDocument();
    expect(screen.getByText(/It is a period of civil war/)).toBeInTheDocument();
    expect(screen.getByText('Characters')).toBeInTheDocument();
    expect(screen.getByText('BACK TO SEARCH')).toBeInTheDocument();

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/movies/1');
  });

  it('renders movie with no characters', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    const movieDataNoCharacters = {
      ...mockMovieData,
      characters: [],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(movieDataNoCharacters),
    } as any);

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('A New Hope')).toBeInTheDocument();
    });

    expect(screen.getByText('No characters found')).toBeInTheDocument();
  });

  it('handles API error', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as any);

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load movie details')).toBeInTheDocument();
    });

    expect(screen.getByText('BACK TO SEARCH')).toBeInTheDocument();
  });

  it('handles missing movie data', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ message: 'ok', result: null, characters: [] }),
    } as any);

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Movie not found')).toBeInTheDocument();
    });

    expect(screen.getByText('BACK TO SEARCH')).toBeInTheDocument();
  });

  it('handles missing uid parameter', async () => {
    mockUseParams.mockReturnValue({ uid: undefined });

    render(<MovieDetailPage />);

    // Should not make API call without uid
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('navigates back to search when button is clicked', async () => {
    const user = userEvent.setup();
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockMovieData),
    } as any);

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('A New Hope')).toBeInTheDocument();
    });

    const backButton = screen.getByText('BACK TO SEARCH');
    await user.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('navigates back to search from error state', async () => {
    const user = userEvent.setup();
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as any);

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load movie details')).toBeInTheDocument();
    });

    const backButton = screen.getByText('BACK TO SEARCH');
    await user.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('renders character links correctly', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockMovieData),
    } as any);

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('A New Hope')).toBeInTheDocument();
    });

    // Verify characters section exists
    expect(screen.getByText('Characters')).toBeInTheDocument();

    // Check that characters are rendered as links
    const characterLinks = screen.getAllByRole('link');
    const characterLinksWithHref = characterLinks.filter(link =>
      link.getAttribute('href')?.startsWith('/people/')
    );
    expect(characterLinksWithHref.length).toBeGreaterThan(0);
  });

  it('handles movie with missing opening crawl', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    const movieDataNoCrawl = {
      ...mockMovieData,
      result: {
        ...mockMovieData.result,
        properties: {
          ...mockMovieData.result.properties,
          opening_crawl: '',
        },
      },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(movieDataNoCrawl),
    } as any);

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('A New Hope')).toBeInTheDocument();
    });

    expect(screen.getByText('Opening Crawl')).toBeInTheDocument();
    // Should not show the opening crawl text when empty
    expect(screen.queryByText(/It is a period of civil war/)).not.toBeInTheDocument();
  });

  it('applies correct CSS classes', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockMovieData),
    } as any);

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('A New Hope')).toBeInTheDocument();
    });

    // Check main container classes
    const mainContainer = screen.getByRole('main');
    expect(mainContainer.className).toContain('container');
    expect(mainContainer.className).toContain('mx-auto');
    expect(mainContainer.className).toContain('px-4');
    expect(mainContainer.className).toContain('py-8');

    // Check white card background
    const cardContainer = screen.getByText('A New Hope').closest('.bg-white');
    expect(cardContainer).toBeInTheDocument();
    expect(cardContainer?.className).toContain('rounded-lg');
    expect(cardContainer?.className).toContain('shadow');
  });

  it('console logs error when API fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as any);

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load movie details')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch movie details:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('refetches data when uid parameter changes', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockMovieData),
    } as any);

    const { rerender } = render(<MovieDetailPage />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/movies/1');
    });

    // Change the uid parameter
    mockUseParams.mockReturnValue({ uid: '2' });
    const newMovieData = {
      ...mockMovieData,
      result: {
        ...mockMovieData.result,
        properties: {
          ...mockMovieData.result.properties,
          title: 'Empire Strikes Back',
          opening_crawl: 'Different crawl'
        }
      },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(newMovieData),
    } as any);

    rerender(<MovieDetailPage />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/movies/2');
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
}); 