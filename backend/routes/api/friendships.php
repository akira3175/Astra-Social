<?php

use App\Http\Controllers\FriendshipController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Friendship Routes
|--------------------------------------------------------------------------
|
| Routes used for sending/accepting friend requests, managing
| friendships, and blocking users. All endpoints are protected
| by JWT authentication.
|
*/

Route::middleware('jwt.auth')->prefix('friendships')->group(function () {

    // ── Friend Requests ────────────────────────────────────────
    Route::post('/request/{userId}', [FriendshipController::class, 'sendRequest']);
    Route::post('/accept/{userId}',  [FriendshipController::class, 'acceptRequest']);
    Route::post('/reject/{userId}',  [FriendshipController::class, 'rejectRequest']);
    Route::post('/cancel/{userId}',  [FriendshipController::class, 'cancelRequest']);

    // ── Friend List & Management ───────────────────────────────
    Route::get('/friends',              [FriendshipController::class, 'listFriends']);
    Route::get('/pending',              [FriendshipController::class, 'pendingRequests']);
    Route::delete('/unfriend/{userId}', [FriendshipController::class, 'unfriend']);

    // ── Block Management ───────────────────────────────────────
    Route::post('/block/{userId}',      [FriendshipController::class, 'blockUser']);
    Route::delete('/unblock/{userId}',  [FriendshipController::class, 'unblockUser']);
});
