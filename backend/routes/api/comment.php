<?php

use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;


// Public routes

// Protected routes
Route::middleware('jwt.auth')->group(function () {
	Route::get('/comments', [CommentController::class, 'index']);
    Route::get('count-comments-admin-days/{days}', [CommentController::class, 'adminGetCountByDays']);
	Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
});
