<?php

use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;


// Public routes

// Protected routes
	Route::get('/comments', [CommentController::class, 'index']);
Route::middleware('jwt.auth')->group(function () {
});
