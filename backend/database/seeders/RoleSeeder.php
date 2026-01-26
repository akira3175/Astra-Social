<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Admin',
                'description' => 'Quản trị viên hệ thống, có toàn quyền.',
            ],
            [
                'name' => 'Dev',
                'description' => 'Nhà phát triển hệ thống.',
            ],
            [
                'name' => 'Mod',
                'description' => 'Người kiểm duyệt nội dung.',
            ],
            [
                'name' => 'User',
                'description' => 'Người dùng thông thường.',
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }
    }
}
