<?php
namespace App\Services;

use App\Models\Comment;

class CommentService{
    public function getComments(array $params){
        $result = Comment::query()->with(['post', 'user', 'parent']);
        if(empty($result)){
            return false;
        }
        return $result->paginate(10);
    }
}