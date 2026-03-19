<?php

use App\Http\Controllers\PermissionController;
use Illuminate\Support\Facades\Route;


// Public routes

// Protected routes
	Route::resource('/permissions', PermissionController::class);
Route::middleware('jwt.auth')->group(function () {
});
