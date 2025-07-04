<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SearchLog;
use Illuminate\Support\Facades\Cache;

class ComputeStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stats:compute';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compute search statistics and cache them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Computing search statistics...');
        
        $logs = SearchLog::all();
        
        $total = $logs->count();
        if ($total === 0) {
            $this->warn('No search logs found.');
            return;
        }
        
        $topQueries = $logs
            ->groupBy('query')
            ->map(fn ($group) => count($group))
            ->sortDesc()
            ->take(5)
            ->map(fn ($count) => [
                'count' => $count,
                'percentage' => round(($count / $total) * 100, 2),
            ]);
        
        $avgDuration = round($logs->avg('duration_ms'), 2);
        
        $popularHour = $logs
            ->groupBy(fn ($log) => $log->created_at->format('H'))
            ->sortDesc()
            ->keys()
            ->first();
        
        $stats = [
            'top_queries' => $topQueries,
            'average_duration_ms' => $avgDuration,
            'most_popular_hour' => $popularHour,
        ];
        
        Cache::put('search_stats', $stats, 3600);
        
        $this->info('Statistics computed and cached successfully!');
        $this->line('Total searches: ' . $total);
        $this->line('Average duration: ' . $avgDuration . 'ms');
        $this->line('Most popular hour: ' . $popularHour . ':00');
    }
}
