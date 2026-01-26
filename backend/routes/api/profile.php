<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/profile/{id}', [ProfileController::class, 'show'])->where('id', '[0-9]+');

// Protected routes
Route::middleware('jwt.auth')->group(function () {
    Route::get('/profile/me', [ProfileController::class, 'me']);
    Route::patch('/profile/me', [ProfileController::class, 'update']);
});
