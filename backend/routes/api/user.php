<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


// Public routes

// Protected routes
Route::middleware('jwt.auth')->group(function () {
	Route::get('/users', [UserController::class, 'index']);
	Route::patch('/users/update-active', [UserController::class, 'updateActive']);
	Route::patch('/users/update-role', [UserController::class, 'updateRole']);
});
