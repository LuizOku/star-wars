<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\SearchLog;
use GuzzleHttp\Client;
use GuzzleHttp\Promise;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->query('query');
        $type = $request->query('type', 'people'); // Default to 'people'
        
        if (!$query) {
            return response()->json(['error' => 'Query is required'], 400);
        }

        // Validate search type
        if (!in_array($type, ['people', 'movies'])) {
            return response()->json(['error' => 'Invalid search type. Use "people" or "movies"'], 400);
        }
    
        $start = microtime(true);
        
        // Determine SWAPI endpoint based on type
        $endpoint = $type === 'people' ? 'people' : 'films';
        $searchParam = $type === 'people' ? 'name' : 'title';
        
        $response = Http::get("https://swapi.tech/api/{$endpoint}", [
            $searchParam => $query
        ]);
    
        $duration = (microtime(true) - $start) * 1000;
    
        if ($response->failed()) {
            return response()->json(['error' => 'SWAPI request failed'], 500);
        }
        
        $data = $response->json();
        
        // Normalize the response structure
        $normalizedResults = $this->normalizeResults($data['result'] ?? [], $type);
        
        // Log the search
        SearchLog::create([
            'query' => $query,
            'search_type' => $type,
            'duration_ms' => $duration,
            'results_count' => count($normalizedResults),
        ]);
    
        return response()->json([
            'message' => $data['message'] ?? 'Search completed',
            'result' => $normalizedResults,
            'total_records' => $data['total_records'] ?? count($normalizedResults),
            'total_pages' => $data['total_pages'] ?? 1,
        ]);
    }

    /**
     * Get person details by UID
     */
    public function getPerson(Request $request, $uid)
    {
        try {
            $response = Http::get("https://swapi.tech/api/people/{$uid}");
            
            if ($response->failed()) {
                return response()->json(['error' => 'Person not found'], 404);
            }
            
            $data = $response->json();
            $person = $data['result'] ?? null;
            
            if (!$person) {
                return response()->json(['error' => 'Person not found'], 404);
            }

            // Fetch all films and find which ones contain this character
            $films = [];
            try {
                $filmsResponse = Http::get("https://swapi.tech/api/films");
                
                if ($filmsResponse->successful()) {
                    $filmsData = $filmsResponse->json();
                    $allFilms = $filmsData['result'] ?? [];
                    
                    foreach ($allFilms as $film) {
                        $characterUrls = $film['properties']['characters'] ?? [];
                        
                        // Check if this character appears in this film
                        $characterInFilm = false;
                        foreach ($characterUrls as $characterUrl) {
                            $characterId = basename(parse_url($characterUrl, PHP_URL_PATH));
                            if ($characterId === $uid) {
                                $characterInFilm = true;
                                break;
                            }
                        }
                        
                        if ($characterInFilm) {
                            $films[] = [
                                'uid' => $film['uid'] ?? '',
                                'name' => $film['properties']['title'] ?? 'Unknown Film'
                            ];
                        }
                    }
                }
            } catch (\Exception $filmsErr) {
                \Log::error("Failed to fetch films for character {$uid}: " . $filmsErr->getMessage());
            }

            return response()->json([
                'message' => 'Person details retrieved successfully',
                'result' => $person,
                'films' => $films
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to fetch person details: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch person details'], 500);
        }
    }

    /**
     * Get movie details by UID
     */
    public function getMovie(Request $request, $uid)
    {
        try {
            $response = Http::get("https://swapi.tech/api/films/{$uid}");

            if ($response->failed()) {
                return response()->json(['error' => 'Movie not found'], 404);
            }

            $data = $response->json();
            $movie = $data['result'] ?? null;

            if (!$movie) {
                return response()->json(['error' => 'Movie not found'], 404);
            }

            $characters = [];
            $characterUrls = $movie['properties']['characters'] ?? [];

            if (!empty($characterUrls)) {
                $client = new Client(['timeout' => 5]);

                // Criar um array de promises
                $promises = [];

                foreach ($characterUrls as $characterUrl) {
                    $characterId = basename(parse_url($characterUrl, PHP_URL_PATH));
                    $promises[$characterId] = $client->getAsync("https://swapi.tech/api/people/{$characterId}");
                }

                // Executa todas as requisições em paralelo
                $results = Promise\Utils::settle($promises)->wait();

                foreach ($results as $characterId => $result) {
                    if ($result['state'] === 'fulfilled') {
                        $responseBody = json_decode($result['value']->getBody()->getContents(), true);
                        $characterResult = $responseBody['result'] ?? null;

                        if ($characterResult) {
                            $characters[] = [
                                'uid' => $characterResult['uid'] ?? $characterId,
                                'name' => $characterResult['properties']['name'] ?? 'Unknown Character',
                            ];
                        }
                    } else {
                        \Log::warning("Failed to fetch character {$characterId}: " . $result['reason']->getMessage());
                    }
                }
            }

            return response()->json([
                'message' => 'Movie details retrieved successfully',
                'result' => $movie,
                'characters' => $characters
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to fetch movie details: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch movie details'], 500);
        }
    }
    
    /**
     * Normalize results from SWAPI to have consistent structure
     */
    private function normalizeResults(array $results, string $type): array
    {
        return array_map(function ($item) use ($type) {
            if ($type === 'people') {
                return [
                    'uid' => $item['uid'] ?? '',
                    'name' => $item['properties']['name'] ?? 'Unknown',
                    'url' => $item['url'] ?? '',
                ];
            } else { // movies/films
                return [
                    'uid' => $item['uid'] ?? '',
                    'name' => $item['properties']['title'] ?? 'Unknown',
                    'url' => $item['url'] ?? '',
                    'episode_id' => $item['properties']['episode_id'] ?? null,
                    'release_date' => $item['properties']['release_date'] ?? null,
                ];
            }
        }, $results);
    }
}
