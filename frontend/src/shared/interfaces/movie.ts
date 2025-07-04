export interface MovieDetails {
  uid: string;
  properties: {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
    characters: string[];
    planets: string[];
    starships: string[];
    vehicles: string[];
    species: string[];
  };
  description: string;
}

export interface MovieCharacter {
  uid: string;
  name: string;
}

export interface MovieResponse {
  message: string;
  result: MovieDetails;
  characters: MovieCharacter[];
}