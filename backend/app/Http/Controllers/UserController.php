<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;

class UserController extends Controller{
    public function __construct(
        private UserService $userService
    ){}

    public function index(Request $request){
        $params = $request->all();

        $users = $this->userService->getUsers($params);
        if(!$users){
            return response()->json([
                'success' => false,
                'message' => 'Không có người dùng nào',
            ]);
        }
        return response()->json([
            'success' => true,
            'data' => $users,
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
    public function update(Request $request){
        $params = $request->all();
        $user = $this->userService->update($params['params']);
        if ($user){
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật thành công',
            ]);                       
        }
        return response()->json([
                'success' => false,
                'message' => 'Không có người dùng nào',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
