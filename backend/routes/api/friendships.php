<?php

use App\Http\Controllers\Api\FriendshipController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Friendship Routes
|--------------------------------------------------------------------------
|
| Routes used for sending/accepting friend requests and managing
| friendships. All endpoints are protected by JWT authentication.
|
*/

Route::middleware('jwt.auth')->group(function () {

    Route::post('/friendships/{userId}/request', [FriendshipController::class, 'sendRequest'])
        ->where('userId', '[0-9]+');
});
