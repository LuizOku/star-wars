import { api } from './api';

export interface SearchResult {
  uid: string;
  name: string;
}

export interface SearchResponse {
  result: SearchResult[];
}

export type SearchType = 'people' | 'movies';

export const searchStarWars = async (query: string, type: SearchType = 'people'): Promise<SearchResult[]> => {
  if (!query.trim()) return [];

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const response = await api.get<SearchResponse>(`/search?query=${encodedQuery}&type=${type}`);
    return response.result || [];
  } catch (error) {
    console.error('Search failed:', error);
    throw new Error('Search failed');
  }
};
