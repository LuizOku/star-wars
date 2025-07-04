export interface SearchResult {
  uid: string;
  name: string;
}

export interface SearchResponse {
  result: SearchResult[];
}