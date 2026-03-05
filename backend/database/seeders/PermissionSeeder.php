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
                'group' => 'Người dùng',
            ],
            [
                'slug'=>'user.ban',
                'description' => 'Khóa/Mở khóa tài khoản',
                'group' => 'Người dùng',
            ],
            [
                'slug'=>'user.assign_role',
                'description' => 'Gán vai trò cho người dùng',
                'group' => 'Người dùng',
            ],
            // post
            [
                'slug'=>'post.view',
                'description' => 'Xem tất cả bài viết',
                'group' => 'Bài viết',
            ],
            [
                'slug'=>'post.delete',
                'description' => 'Xóa bài viết',
                'group' => 'Bài viết',
            ],
            [
                'slug'=>'post.restore',
                'description' => 'Khôi phục bài viết đã xóa',
                'group' => 'Bài viết',
            ],
            // comment
            [
                'slug'=>'comment.view',
                'description' => 'Xem tất cả bình luận',
                'group' => 'Bình luận',
            ],
            [
                'slug'=>'comment.delete',
                'description' => 'Xóa bình luận',
                'group' => 'Bình luận',
            ],
            // report
            [
                'slug'=>'report.view',
                'description' => 'Xem danh sách báo cáo',
                'group' => 'Báo cáo',
            ],
            [
                'slug'=>'report.resolve',
                'description' => 'Xử lý báo cáo (xóa nội dung)',
                'group' => 'Báo cáo',
            ],
            [
                'slug'=>'report.reject',
                'description' => 'Từ chối báo cáo',
                'group' => 'Báo cáo',
            ],
            // role
            [
                'slug'=>'role.view',
                'description' => 'Xem danh sách vai trò',
                'group' => 'Vai trò',
            ],
            [
                'slug'=>'role.create',
                'description' => 'Tạo vai trò mới',
                'group' => 'Vai trò',
            ],
            [
                'slug'=>'role.edit',
                'description' => 'Chỉnh sửa vai trò',
                'group' => 'Vai trò',
            ],
            [
                'slug'=>'role.delete',
                'description' => 'Xóa vai trò',
                'group' => 'Vai trò',
            ],
            // dashboard
            [
                'slug'=>'dashboard.view',
                'description' => 'Xem trang tổng quan',
                'group' => 'Dashboard',
            ],

        ];
        foreach($permissions as $per){
            Permission::firstOrCreate($per);
        }
    }
}
