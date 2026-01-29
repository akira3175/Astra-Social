<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Post Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show'])->where('id', '[0-9]+');
Route::get('/users/{userId}/posts', [PostController::class, 'byUser'])->where('userId', '[0-9]+');

// Protected routes
Route::middleware('jwt.auth')->group(function () {
    Route::get('/posts/me', [PostController::class, 'myPosts']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::patch('/posts/{id}', [PostController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/posts/{id}', [PostController::class, 'destroy'])->where('id', '[0-9]+');
});
