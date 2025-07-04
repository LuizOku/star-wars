<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\StatsController;

Route::get('/search', [SearchController::class, 'search']);
Route::get('/stats', [StatsController::class, 'index']);
