<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\StatsController;

Route::get('/search', [SearchController::class, 'search']);
Route::get('/people/{uid}', [SearchController::class, 'getPerson']);
Route::get('/movies/{uid}', [SearchController::class, 'getMovie']);
Route::get('/stats', [StatsController::class, 'index']);
