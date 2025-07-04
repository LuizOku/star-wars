'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';
import Link from 'next/link';

interface PersonDetails {
  uid: string;
  properties: {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld: string;
    films: string[];
  };
  description: string;
}

interface Film {
  uid: string;
  name: string;
}

interface PersonResponse {
  message: string;
  result: PersonDetails;
  films: Film[];
}

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
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
          <div className="flex justify-center items-center min-h-96">
            <p className="text-xl text-dark-grey">Loading character details...</p>
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