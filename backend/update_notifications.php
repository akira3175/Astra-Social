<?php

use App\Models\Notification;
use Illuminate\Support\Facades\DB;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$count = 0;
Notification::whereNull('type')->chunk(100, function ($notifications) use (&$count) {
    foreach ($notifications as $n) {
        $m = mb_strtolower($n->message, 'UTF-8');
        $updated = false;
        
        if (str_contains($m, 'thích')) {
            $n->type = 'LIKE';
            $updated = true;
        } elseif (str_contains($m, 'bình luận')) {
            $n->type = 'COMMENT';
            $updated = true;
        } elseif (str_contains($m, 'trả lời')) {
            $n->type = 'REPLY';
            $updated = true;
        } elseif (str_contains($m, 'kết bạn')) {
            $n->type = 'FRIEND_REQ';
            $updated = true;
        } elseif (str_contains($m, 'chấp nhận')) {
            $n->type = 'FRIEND_ACCEPT';
            $updated = true;
        }
        
        if ($updated) {
            $n->save();
            $count++;
        }
    }
});

echo "Successfully updated $count notifications.\n";
