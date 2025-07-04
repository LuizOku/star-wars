<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SearchLog;
use Illuminate\Support\Facades\Cache;

class StatsController extends Controller
{
    public function index()
    {
        $stats = Cache::get('search_stats', [
            'message' => 'Stats not ready yet',
        ]);

        return response()->json($stats);
    }
}
