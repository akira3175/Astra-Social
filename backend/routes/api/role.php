<?php

use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;


// Public routes
// Protected routes
Route::middleware('jwt.auth')->group(function () {
	Route::resource('/roles', RoleController::class);
});
