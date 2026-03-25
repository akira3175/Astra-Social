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
        $devRole = Role::where('name', 'Dev')->first();
        $userRole = Role::where('name', 'User')->first();
        $adminRole = Role::where('name', 'Admin')->first();

        if ($devRole) {
            User::updateOrCreate(
                ['email' => 'dev@example.com'],
                [
                    'username' => 'dev',
                    'password' => 'password',
                    'role_id' => $devRole->id,
                    'is_active' => true,
                    'is_verified' => true,
                ]
            );
        }

        if ($userRole) {
            User::updateOrCreate(
                ['email' => 'user1@example.com'],
                [
                    'username' => 'user1',
                    'password' => 'password',
                    'role_id' => $userRole->id,
                    'is_active' => true,
                    'is_verified' => false,
                ]
            );
        }

        if ($adminRole) {
            $adminExists = User::where('email', 'admin@example.com')->exists();
            if (!$adminExists) {
                User::create([
                    'username' => 'admin',
                    'email' => 'admin@example.com',
                    'password' => 'password', // Sẽ được hash tự động nhờ cast 'hashed'
                    'role_id' => $adminRole->id,
                    'is_active' => true,
                    'is_verified' => true,
                ]);
            }
        }

        User::factory()->count(20)->create();
    }
}
