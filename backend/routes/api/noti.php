<?php

use App\Http\Controllers\NotiController;
use Illuminate\Support\Facades\Route;


// Public routes

// Protected routes
	Route::get('/noti/by-isread', [NotiController::class, 'getByIsRead']);
Route::middleware('jwt.auth')->group(function () {
	Route::resource('/noti', NotiController::class);
});
