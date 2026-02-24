<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy role Dev
        $devRole = Role::where('name', 'Dev')->first();
        $userRole = Role::where('name', 'User')->first();

        if ($devRole) {
            User::firstOrCreate(
                ['username' => 'dev'],
                [
                    'email' => 'dev@example.com',
                    'password' => 'password', // Sẽ được hash tự động nhờ cast 'hashed'
                    'role_id' => $devRole->id,
                    'is_active' => true,
                    'is_verified' => true,
                ]
            );
        }
        if ($userRole) {
        User::firstOrCreate(
            ['username' => 'user1'],
            [
                'email' => 'user1@example.com',
                'password' => 'password',
                'role_id' => $userRole->id,
                'is_active' => true,
                'is_verified' => false,
            ]
        );
    }
    }
}
