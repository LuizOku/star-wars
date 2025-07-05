import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams, useRouter } from 'next/navigation';
import PersonDetailPage from '../../app/people/[uid]/page';

// Mock fetch globally
global.fetch = jest.fn();

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

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('PersonDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as never);
  });

  const mockPersonData = {
    message: 'ok',
    result: {
      uid: '1',
      properties: {
        name: 'Luke Skywalker',
        birth_year: '19BBY',
        gender: 'male',
        eye_color: 'blue',
        hair_color: 'blond',
        height: '172',
        mass: '77',
        skin_color: 'fair',
        homeworld: 'https://www.swapi.tech/api/planets/1',
        films: [],
      },
      description: 'A person within the Star Wars universe',
    },
    films: [
      { uid: '1', name: 'A New Hope' },
      { uid: '2', name: 'The Empire Strikes Back' },
      { uid: '3', name: 'Return of the Jedi' },
    ],
  };

  it('shows loading state initially', () => {
    mockUseParams.mockReturnValue({ uid: '1' });

    render(<PersonDetailPage />);

    // Should show loading skeleton
    expect(screen.getByText('SWStarter')).toBeInTheDocument();

    // Check for loading skeleton elements
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders person details successfully', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPersonData),
    } as any);

    render(<PersonDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Birth Year: 19BBY')).toBeInTheDocument();
    expect(screen.getByText('Gender: male')).toBeInTheDocument();
    expect(screen.getByText('Eye Color: blue')).toBeInTheDocument();
    expect(screen.getByText('Hair Color: blond')).toBeInTheDocument();
    expect(screen.getByText('Height: 172')).toBeInTheDocument();
    expect(screen.getByText('Mass: 77')).toBeInTheDocument();

    expect(screen.getByText('Movies')).toBeInTheDocument();
    expect(screen.getByText('BACK TO SEARCH')).toBeInTheDocument();

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/people/1');
  });

  it('renders person with no movies', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    const personDataNoMovies = {
      ...mockPersonData,
      films: [],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(personDataNoMovies),
    } as any);

    render(<PersonDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    expect(screen.getByText('No movies found')).toBeInTheDocument();
  });

  it('handles API error', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as any);

    render(<PersonDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load character details')).toBeInTheDocument();
    });

    expect(screen.getByText('BACK TO SEARCH')).toBeInTheDocument();
  });

  it('handles missing person data', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ message: 'ok', result: null, films: [] }),
    } as any);

    render(<PersonDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Character not found')).toBeInTheDocument();
    });

    expect(screen.getByText('BACK TO SEARCH')).toBeInTheDocument();
  });

  it('handles missing uid parameter', async () => {
    mockUseParams.mockReturnValue({ uid: undefined });

    render(<PersonDetailPage />);

    // Should not make API call without uid
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('navigates back to search when button is clicked', async () => {
    const user = userEvent.setup();
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPersonData),
    } as any);

    render(<PersonDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
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

    render(<PersonDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load character details')).toBeInTheDocument();
    });

    const backButton = screen.getByText('BACK TO SEARCH');
    await user.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('renders movie links correctly', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPersonData),
    } as any);

    render(<PersonDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    // Verify movies section exists
    expect(screen.getByText('Movies')).toBeInTheDocument();

    // Check that movies are rendered as links
    const movieLinks = screen.getAllByRole('link');
    const movieLinksWithHref = movieLinks.filter(link =>
      link.getAttribute('href')?.startsWith('/movies/')
    );
    expect(movieLinksWithHref.length).toBeGreaterThan(0);
  });

  it('displays all person properties correctly', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    const personWithDifferentData = {
      ...mockPersonData,
      result: {
        ...mockPersonData.result,
        properties: {
          ...mockPersonData.result.properties,
          name: 'Princess Leia',
          gender: 'female',
          eye_color: 'brown',
          hair_color: 'brown',
          height: '150',
          mass: '49',
        },
      },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(personWithDifferentData),
    } as any);

    render(<PersonDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Princess Leia')).toBeInTheDocument();
    });

    expect(screen.getByText('Birth Year: 19BBY')).toBeInTheDocument();
    expect(screen.getByText('Gender: female')).toBeInTheDocument();
    expect(screen.getByText('Eye Color: brown')).toBeInTheDocument();
    expect(screen.getByText('Hair Color: brown')).toBeInTheDocument();
    expect(screen.getByText('Height: 150')).toBeInTheDocument();
    expect(screen.getByText('Mass: 49')).toBeInTheDocument();
  });

  it('applies correct CSS classes', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPersonData),
    } as any);

    render(<PersonDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    // Check main container classes
    const mainContainer = screen.getByRole('main');
    expect(mainContainer.className).toContain('container');
    expect(mainContainer.className).toContain('mx-auto');
    expect(mainContainer.className).toContain('px-4');
    expect(mainContainer.className).toContain('py-8');

    // Check white card background
    const cardContainer = screen.getByText('Luke Skywalker').closest('.bg-white');
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

    render(<PersonDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load character details')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch person details:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('refetches data when uid parameter changes', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPersonData),
    } as any);

    const { rerender } = render(<PersonDetailPage />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/people/1');
    });

    // Change the uid parameter
    mockUseParams.mockReturnValue({ uid: '2' });
    const newPersonData = {
      ...mockPersonData,
      result: {
        ...mockPersonData.result,
        properties: {
          ...mockPersonData.result.properties,
          name: 'Princess Leia',
          gender: 'female',
          eye_color: 'brown',
          hair_color: 'brown',
          height: '150',
          mass: '49',
        }
      },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(newPersonData),
    } as any);

    rerender(<PersonDetailPage />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/people/2');
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('handles person with single movie', async () => {
    mockUseParams.mockReturnValue({ uid: '1' });
    const personWithOneMovie = {
      ...mockPersonData,
      films: [{ uid: '1', name: 'A New Hope' }],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(personWithOneMovie),
    } as any);

    render(<PersonDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    expect(screen.getByText('A New Hope')).toBeInTheDocument();
    expect(screen.queryByText('The Empire Strikes Back')).not.toBeInTheDocument();
  });
}); 