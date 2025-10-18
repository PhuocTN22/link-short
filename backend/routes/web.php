<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RedirectController;

Route::get('/r/{slug}', RedirectController::class)->where('slug', '[A-Za-z0-9_-]+');