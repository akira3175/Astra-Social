<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = app(App\Services\PostService::class);
echo json_encode($service->getNewsFeed(4, 1, 1)['posts'][0] ?? null, JSON_PRETTY_PRINT);
