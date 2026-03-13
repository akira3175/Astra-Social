<?php
namespace App\Services;

use App\Models\User;
use App\Models\Role;

class UserService{
    public function getUsers(array $params){
        $users = User::query()
                    ->with('role')
                    ->orderBy('created_at', 'desc');
        if(!empty($params['role']) ){
            $users->whereHas('role', function ($q) use ($params){
                $q->where('name', $params['role']);
            });
        }

        if (!empty($params['search'])){
            $users->where('email', 'like', '%'. $params['search']. '%');
        }

        if(strtolower($params['status'])==='active'){
            $users->where('is_active', true);
        }
        if(strtolower($params['status'])==='banned'){
            $users->whereNotNull('deleted_at');
        }
        if(strtolower($params['status'])==='verified'){
            $users->where('is_verified', true);
        }
        if(strtolower($params['status'])==='unverified'){
            $users->where('is_active', false);
        }
        return $users->paginate(10);
    }

    public function updateActive(array $params){
        if (empty($params['id'])){
            return false;
        }
        $user = User::find($params['id']);
        if (!$user) return false;

        if ($params['is_active']){
            $user->update(['is_active'=> true]);
            return true;
        }
        else{
            $user->update(['is_active'=> false]);
            return true;
        }

        return false;
    }
    public function updateRole(array $params){
        if (empty($params['id'])){
            return false;
        }
        $user = User::find($params['id']);
        if (!$user) return false;

        if (!empty($params['role_id'])){
            $role = Role::find($params['role_id']);
            if($role){
                $user->update(['role_id'=> $role->id]);
                return true;
            }
        }

        return false;
    }
    
}