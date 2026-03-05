<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role_permissions;

class RolePermissionsSeeder extends Seeder{

    public function run(): void{
        $items=[
            [
                'role_id'=> 1,
                'permission_id' =>1,
            ],
            [
                'role_id'=> 1,
                'permission_id' =>2,
            ],
            [
                'role_id'=> 1,
                'permission_id' =>3,
            ],
            [
                'role_id'=> 1,
                'permission_id' =>4,
            ],
            [
                'role_id'=> 1,
                'permission_id' =>5,
            ],
            [
                'role_id'=> 2,
                'permission_id' =>1,
            ],
            [
                'role_id'=> 2,
                'permission_id' =>2,
            ],
            [
                'role_id'=> 3,
                'permission_id' =>3,
            ],
            [
                'role_id'=> 4,
                'permission_id' =>1,
            ],
            [
                'role_id'=> 4,
                'permission_id' =>2,
            ],
            [
                'role_id'=> 4,
                'permission_id' =>3,
            ],
        ];
        foreach($items as $item){
            Role_permissions::firstOrCreate($item);
        }
    }
}
