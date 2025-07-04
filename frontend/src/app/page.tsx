'use client';

import { useState } from 'react';
import Header from '@/components/ui/Header';
import SearchForm from '@/components/SearchForm';
import ResultsList from '@/components/ResultsList';
import { api } from '@/services/api';
import { SearchResponse, SearchResult } from '@/shared/interfaces/search';


export type SearchType = 'people' | 'movies';
export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<SearchType>('people');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await api.get<SearchResponse>(`/search?query=${query}&type=${searchType}`);
      setResults(data.result || []);
    } catch (err) {
      console.error('Search failed:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 max-w-6xl mx-auto">
          <div>
            <SearchForm
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              loading={loading}
              error={error}
              searchType={searchType}
              setSearchType={setSearchType}
            />
          </div>
          <div>
            <ResultsList results={results} loading={loading} searchType={searchType} />
          </div>
        </div>
      </main>
    </div>
  );
}
