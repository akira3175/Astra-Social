<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\Role_permissions;
use App\Models\Permission;

class RoleController extends Controller{
    public function index(){
        $roles = Role::withCount('users as user_count')->get();
        $permissions = Role_permissions::with('permissions')
                                    ->whereIn('role_id',$roles->pluck('id'))
                                    ->get()
                                    ->groupBy('role_id');
        $roles = $roles->map(function ($role) use ($permissions){
            $role->permissions = $permissions[$role->id]
                                ->pluck('permissions')
                                ->values() ?? collect();
            return $role;
        });
        return response()->json([
            'success' => true,
            'data' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
