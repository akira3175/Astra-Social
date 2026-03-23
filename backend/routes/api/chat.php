<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::middleware('jwt.auth')->group(function () {
    Route::get('/conversations', [ChatController::class, 'getConversations']);
    Route::get('/conversations/{id}/messages', [ChatController::class, 'getMessages']);
    Route::post('/chat/private', [ChatController::class, 'sendPrivateMessage']);
    Route::post('/chat/group', [ChatController::class, 'createGroup']);
    Route::post('/chat/group/{id}/send', [ChatController::class, 'sendGroupMessage']);
    Route::put('/chat/group/{id}/rename', [ChatController::class, 'renameGroup']);
    Route::delete('/chat/group/{id}/leave', [ChatController::class, 'leaveGroup']);
    Route::post('/chat/group/{id}/add-admin', [ChatController::class, 'addAdmin']);
    Route::delete('/chat/group/{id}/remove-member/{targetId}', [ChatController::class, 'removeMember']);
});