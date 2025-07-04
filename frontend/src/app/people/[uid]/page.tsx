'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';
import Link from 'next/link';
import { PersonDetails, PersonFilm, PersonResponse } from '@/shared/interfaces/person';



export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [films, setFilms] = useState<PersonFilm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      if (!params.uid) return;

      try {
        setLoading(true);
        const data = await api.get<PersonResponse>(`/people/${params.uid}`);
        setPerson(data.result);
        setFilms(data.films || []);
      } catch (err) {
        console.error('Failed to fetch person details:', err);
        setError('Failed to load character details');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [params.uid]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="h-6 bg-gray-200 rounded w-48 mb-5 animate-pulse"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-16 mb-4 animate-pulse"></div>
                  <hr className="border-pinkish-grey mb-2" />
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 ml-2 animate-pulse"></div>
                      </div>
                      <div className="flex">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-12 ml-2 animate-pulse"></div>
                      </div>
                      <div className="flex">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-10 ml-2 animate-pulse"></div>
                      </div>
                      <div className="flex">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-14 ml-2 animate-pulse"></div>
                      </div>
                      <div className="flex">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-8 ml-2 animate-pulse"></div>
                      </div>
                      <div className="flex">
                        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-6 ml-2 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-16 mb-4 animate-pulse"></div>
                  <hr className="border-pinkish-grey mb-2" />
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
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

  if (error || !person) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
              {error || 'Character not found'}
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
            <h1 className="text-xl font-bold text-dark-grey mb-5">{person.properties.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-dark-grey mb-4">Details</h2>
                <hr className="border-pinkish-grey mb-5" />

                <p className="text-dark-grey leading-tight text-md">Birth Year: {person.properties.birth_year}</p>
                <p className="text-dark-grey leading-tight text-md">Gender: {person.properties.gender}</p>
                <p className="text-dark-grey leading-tight text-md">Eye Color: {person.properties.eye_color}</p>
                <p className="text-dark-grey leading-tight text-md">Hair Color: {person.properties.hair_color}</p>
                <p className="text-dark-grey leading-tight text-md">Height: {person.properties.height}</p>
                <p className="text-dark-grey leading-tight text-md">Mass: {person.properties.mass}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-bold text-dark-grey mb-4">Movies</h2>
                <hr className="border-pinkish-grey mb-2" />
                <div className="space-y-3">
                  {films.length > 0 ? (
                    films.map((film) => (
                      <Link
                        key={film.uid}
                        href={`/movies/${film.uid}`}
                        className="text-md text-emerald underline hover:text-emerald/80 cursor-pointer"
                      >
                        {film.name}{films.indexOf(film) < films.length - 1 ? ", " : ""}
                      </Link>
                    ))
                  ) : (
                    <p className="text-pinkish-grey">No movies found</p>
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