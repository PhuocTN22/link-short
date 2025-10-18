<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ShortenController;
use App\Http\Controllers\Api\StatsController;

Route::post('/shorten', [ShortenController::class, 'store'])->name('shorten.store');
Route::get('/stats', [StatsController::class, 'index'])->name('stats.index');
