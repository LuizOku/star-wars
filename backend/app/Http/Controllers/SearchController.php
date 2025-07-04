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
        if (!$query) return response()->json(['error' => 'Query is required'], 400);
    
        $start = microtime(true);
    
        $response = Http::get("https://swapi.tech/api/people", ['name' => $query]);
    
        $duration = (microtime(true) - $start) * 1000;
    
        if ($response->failed()) return response()->json(['error' => 'SWAPI request failed'], 500);
    
        SearchLog::create([
            'query' => $query,
            'duration_ms' => $duration,
        ]);
    
        return response()->json($response->json());
    }
}
