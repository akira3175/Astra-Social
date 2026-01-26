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
    }
}
