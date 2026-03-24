<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Post Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show'])->where('id', '[0-9]+');
Route::get('/users/{userId}/posts', [PostController::class, 'byUser'])->where('userId', '[0-9]+');
Route::get('/hashtags/search', [PostController::class, 'searchHashtag']);
Route::get('/hashtags/trending', [PostController::class, 'trendingHashtags']);
Route::get('/hashtags/{hashtagName}', [PostController::class, 'hashtagPosts'])
    ->where('hashtagName', '[A-Za-z0-9_]+');
Route::get('/search', [PostController::class, 'search']);


// Tất cả routes cần auth đều dùng jwt.auth
Route::middleware('jwt.auth')->group(function () {
    Route::get('posts-admin', [PostController::class, 'adminIndex']);
    Route::get('count-posts-admin-days/{days}', [PostController::class, 'adminGetCountByDays']);
    Route::get('/posts/me', [PostController::class, 'myPosts']);
    Route::get('/posts/feed', [PostController::class, 'newsfeed']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::patch('/posts/{id}', [PostController::class, 'update'])->where('id', '[0-9]+');
    Route::patch('/post-restore/{id}', [PostController::class, 'restorePostById']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy'])->where('id', '[0-9]+');

    Route::post('/posts/{id}/like', [PostController::class, 'like']);
    Route::post('/posts/{id}/comments', [PostController::class, 'comment']);
    Route::get('/posts/{id}/comments', [PostController::class, 'getComments']);
    Route::post('/posts/{id}/share', [PostController::class, 'share']);
    Route::post('/comments/{id}/like', [PostController::class, 'likeComment']);
    Route::delete('/posts-admin/{id}', [PostController::class, 'adminDestroy']);
    Route::post('/posts/{id}/share', [PostController::class, 'share']);

});
