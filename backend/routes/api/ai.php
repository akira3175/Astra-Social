<?php

use App\Http\Controllers\AiController;
use Illuminate\Support\Facades\Route;

Route::middleware('jwt.auth')->group(function () {
    Route::post('/ai/improve-text',      [AiController::class, 'improveText']);
    Route::post('/ai/generate-caption',  [AiController::class, 'generateCaption']);
});
