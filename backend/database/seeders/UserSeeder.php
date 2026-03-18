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
        $adminRole = Role::where('name', 'Admin')->first();


        if ($devRole) {
            $result = User::where('email', 'dev@example.com');
                if(!$result){
                    User::create([
                        'username' => 'dev',
                        'email' => 'dev@example.com',
                        'password' => 'password', // Sẽ được hash tự động nhờ cast 'hashed'
                        'role_id' => $devRole->id,
                        'is_active' => true,
                        'is_verified' => true,
                    ]);
                }
        }
        if ($adminRole) {
            $result = User::where('email', 'admin@example.com');
                if(!$result){
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
