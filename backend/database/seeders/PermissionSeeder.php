<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void{
        $permissions = [
            // user
            [
                'slug'=>'user.view',
                'description' => 'Xem danh sách người dùng',
                'group' => 'USER',
            ],
            [
                'slug'=>'user.ban',
                'description' => 'Khóa/Mở khóa tài khoản',
                'group' => 'USER',
            ],
            [
                'slug'=>'user.assign_role',
                'description' => 'Gán vai trò cho người dùng',
                'group' => 'USER',
            ],
            // post
            [
                'slug'=>'post.view',
                'description' => 'Xem tất cả bài viết',
                'group' => 'POST',
            ],
            [
                'slug'=>'post.delete',
                'description' => 'Xóa bài viết',
                'group' => 'POST',
            ],
            [
                'slug'=>'post.restore',
                'description' => 'Khôi phục bài viết đã xóa',
                'group' => 'POST',
            ],
            // comment
            [
                'slug'=>'comment.view',
                'description' => 'Xem tất cả bình luận',
                'group' => 'COMMENT',
            ],
            [
                'slug'=>'comment.delete',
                'description' => 'Xóa bình luận',
                'group' => 'COMMENT',
            ],
            // report
            [
                'slug'=>'report.view',
                'description' => 'Xem danh sách báo cáo',
                'group' => 'REPORT',
            ],
            [
                'slug'=>'report.resolve',
                'description' => 'Xử lý báo cáo (xóa nội dung)',
                'group' => 'REPORT',
            ],
            [
                'slug'=>'report.reject',
                'description' => 'Từ chối báo cáo',
                'group' => 'REPORT',
            ],
            // role
            [
                'slug'=>'role.view',
                'description' => 'Xem danh sách vai trò',
                'group' => 'ROLE',
            ],
            [
                'slug'=>'role.create',
                'description' => 'Tạo vai trò mới',
                'group' => 'ROLE',
            ],
            [
                'slug'=>'role.edit',
                'description' => 'Chỉnh sửa vai trò',
                'group' => 'ROLE',
            ],
            [
                'slug'=>'role.delete',
                'description' => 'Xóa vai trò',
                'group' => 'ROLE',
            ],
            // dashboard
            [
                'slug'=>'dashboard.view',
                'description' => 'Xem trang tổng quan',
                'group' => 'DASHBOARD',
            ],

        ];
        foreach($permissions as $per){
            Permission::firstOrCreate($per);
        }
    }
}
