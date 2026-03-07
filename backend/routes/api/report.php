<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;


// Public routes

// Protected routes
Route::middleware('jwt.auth')->group(function () {
	Route::resource('/reports', ReportController::class);
	Route::patch('/reports', [ReportController::class, 'handleStatus']);
});
