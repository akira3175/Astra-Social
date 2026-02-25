<?php

use App\Http\Controllers\FriendshipController;
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

    Route::post('/friendships/request/{userId}', [FriendshipController::class, 'sendRequest']);
    Route::post('/friendships/accept/{userId}',  [FriendshipController::class, 'acceptRequest']) ;
});
