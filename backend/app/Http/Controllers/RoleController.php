<?php

namespace App\Http\Controllers;

use Illuminate\Validation\ValidationException;
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
            $role->permissions = isset($permissions[$role->id])
                                ?$permissions[$role->id]->pluck('permissions')->values()
                                : collect();
            // $role->permissions = $permissions[$role->id]
            //                     ->pluck('permissions')->values()
            //                     : collect();
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
    public function store(Request $request){
        $data = $request->all();
        $validated = $this->check($request);
        if(!$validated){
            return response()->json([
                'success' => false,
                'errors' => 'Tên role bị trùng. Vui lòng nhập tên khác',
            ]);

        }
        $role = Role::create([
            'name'=>$validated['name'],
            'is_default'=>false,
            'description' => $validated['description'] ?? null,
        ]);

        if ($role){
            foreach ($validated['permissions'] as $permissionId) {
                Role_permissions::create([
                    'role_id' => $role->id,
                    'permission_id' => $permissionId,
                ]);
            }
            return response()->json([
                'success'=>true,
                'data' => $data,
            ]);
        }
        return response()->json([
            'success'=>false,
            'data' => $data,
        ]);
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
    public function update(Request $request, ?string $id=null){
        $data = $request->all();
        $validated = $this->check($request);
        if(!$validated){
            return response()->json([
                'success' => false,
                'errors' => 'Tên role bị trùng. Vui lòng nhập tên khác',
            ]);

        }
        $role = Role::find($data['id']);
        if(!$role){
            return response()->json([
                'success' => false,
                'message' => 'Role not found'
            ]);
        }
        $role->update([
            'name'=>$validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        $ro_per = Role_permissions::where('role_id', $role->id);
        $ro_per->forceDelete();
        foreach ($validated['permissions'] as $permissionId) {
            Role_permissions::create([
                'role_id'=>$role->id,
                'permission_id'=>$permissionId,
            ]);
        }
        return response()->json([
            'success'=>true,
            'data' => $data,
        ]);

    }

    public function destroy(string $id){
        $role = Role::find($id);
        if(!$role){
            return response()->json([
                'success' => false,
                'message' => 'Role không tồn tại',
            ]);            
        }

        $ro_per = Role_permissions::where('role_id', $id)->delete();

        $role->delete();
        return response()->json([
            'success' => true,
            'data' => $role,
            'message' => 'Đã xóa Role thành công',
        ]);
    }

    private function check(Request $request){
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles,name',
                'description' => 'nullable|string',
                'permissions' => 'nullable|array',
                'permissions.*' => 'integer|exists:permissions,id',
            ]);
        }
        catch (ValidationException $e) {
            return false;
        }
        return $validated;
    }
}
