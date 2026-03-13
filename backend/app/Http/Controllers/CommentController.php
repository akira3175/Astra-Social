<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CommentService;

class CommentController extends Controller{
    public function __construct(
        private CommentService $commentService
    ){}

    public function index(Request $request){
        $params= $request->all();
        $comments = $this->commentService->getComments($params);
        if($comments){
            return response()->json([
                'success'=>true,
                'data'=>$comments,
            ]);
        }
        return response()->json([
            'success'=>false,
            'data'=> 'Không có bình luận nào',
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

    public function destroy(Request $request, string $id){
        $params=$request->all();
        $comment = $this->commentService->destroy($params['auth_user'], $id);
        if(!empty($comment)){
            return response()->json([
                'success'=>true,
                'message'=>'Xóa bình luận thành công',
            ]);
        }
        return response()->json([
            'success'=>false,
            'message'=>'Xóa bình luận thất bại',
        ]);
    }
}
