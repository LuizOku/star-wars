'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';
import Link from 'next/link';
import { MovieDetails, MovieResponse, MovieCharacter } from '@/shared/interfaces/movie';


export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [characters, setCharacters] = useState<MovieCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!params.uid) return;

      try {
        setLoading(true);
        const data = await api.get<MovieResponse>(`/movies/${params.uid}`);
        setMovie(data.result);
        setCharacters(data.characters || []);
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [params.uid]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="h-6 bg-gray-200 rounded w-64 mb-5 animate-pulse"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                  <hr className="border-pinkish-grey mb-2" />
                  <div className="space-y-4 md:max-w-2/3">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
                  <hr className="border-pinkish-grey mb-2" />
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-14 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-18 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
              {error || 'Movie not found'}
            </div>
            <Button onClick={() => router.push('/')}>
              BACK TO SEARCH
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-xl font-bold text-dark-grey mb-5">{movie.properties.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-dark-grey mb-4">Opening Crawl</h2>
                <hr className="border-pinkish-grey mb-2" />
                {movie.properties.opening_crawl && (
                  <div className="space-y-4 md:max-w-2/3">
                    <p className="text-dark-grey text-md leading-tight">
                      {movie.properties.opening_crawl}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-bold text-dark-grey mb-4">Characters</h2>
                <hr className="border-pinkish-grey mb-2" />
                <div className="space-y-3">
                  {characters.length > 0 ? (
                    characters.map((character) => (
                      <Link
                        key={character.uid}
                        href={`/people/${character.uid}`}
                        className="text-md text-emerald underline hover:text-emerald/80 cursor-pointer"
                      >
                        {character.name}{characters.indexOf(character) < characters.length - 1 ? ", " : ""}
                      </Link>
                    ))
                  ) : (
                    <p className="text-pinkish-grey">No characters found</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Button
                onClick={() => router.push('/')}
                className="bg-green-teal hover:bg-green-teal/90 text-white px-8 py-3 rounded-lg font-semibold"
              >
                BACK TO SEARCH
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 