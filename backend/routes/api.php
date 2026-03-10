<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| Routes are organized into separate files by module for better teamwork.
|
*/

// Load route files
require __DIR__ . '/api/auth.php';
require __DIR__ . '/api/profile.php';
require __DIR__ . '/api/posts.php';
require __DIR__ . '/api/report.php';
require __DIR__ . '/api/friendships.php';
require __DIR__ . '/api/role.php';
require __DIR__ . '/api/permission.php';
require __DIR__ . '/api/noti.php';
require __DIR__ . '/api/user.php';