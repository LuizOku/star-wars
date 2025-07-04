<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\SearchLog;

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
