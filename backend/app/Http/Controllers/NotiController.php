<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotiController extends Controller{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request){
        $params = $request->all();
        $data = Notification::where('receiver_id', (int)$params['user_id'])
                            ->limit($params['limit'])
                            ->get();
        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function getByIsRead(Request $request){
        $params = $request->all();
        $data = Notification::where([
            'receiver_id' => (int)$params['user_id'],
            'is_read' => $params['is_read']
        ])->count();

        return response()->json([
            'success' => true,
            'data' => $data,
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
