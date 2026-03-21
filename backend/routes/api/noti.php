<?php

use App\Http\Controllers\NotiController;
use Illuminate\Support\Facades\Route;


// Public routes

// Protected routes
	Route::get('/noti/by-isread', [NotiController::class, 'getByIsRead']);
	Route::middleware('jwt.auth')->group(function () {

	Route::put('/noti/read-all', [NotiController::class, 'markAllAsRead']);
    Route::put('/noti/{id}/read', [NotiController::class, 'markAsRead']);

	Route::resource('/noti', NotiController::class);
	
});
