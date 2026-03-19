<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            FriendshipSeeder::class,
            // ReportSeeder::class,
            PostSeeder::class,
            PermissionSeeder::class,
            RolePermissionsSeeder::class,
            // NotificationSeeder::class,
            CommentSeeder::class,
        ]);
    }
}
