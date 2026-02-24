<?php
namespace App\Services;

use App\Models\MediaAttachment;
use App\Models\Report;
use App\Models\Post;
use App\Models\User;
use App\Models\Comment;

class ReportService{

    public function create(User $user, array $data){
    	if($data['target_type']===Report::TARGET_TYPE_POST){
    		$post = Post::find($data['target_id']);
    		if(!$post){
    			return [
                    'success' => false,
                    'message' => 'Parent post not found',
                    'code' => 404,
    			];
    		}
    	}
    	if($data['target_type']===Report::TARGET_TYPE_USER){
    		$user = User::find($data['target_id']);
    		if(!$user){
    			return [
                    'success' => false,
                    'message' => 'User not found',
                    'code' => 404,
    			];    			
    		}
    	}
    	if($data['target_type']===Report::TARGET_TYPE_COMMENT){
    		$comment = Comment::find($data['target_id']);
    		if(!$comment){
    			return [
                    'success' => false,
                    'message' => 'Comment not found',
                    'code' => 404,    				
    			];
    		}
    	}
    	$report = Report::create([
    		'reporter_id'=>$user->id,
    		'target_type'=>$data['target_type'],
    		'target_id' => $data['target_id'],
    		'reason' => $data['reason'],
    		'status' =>$data['status']
    	]);

    	return [
            'success' => true,
            'data' => $data,
    	];
    }

    public function getReports(int $page, int $perPage = 10){
        $query = Report::orderBy('id', 'desc');
        $reports = $query->paginate($perPage, ['*'], 'page', $page);
        return [
            'reports' => $reports->items(),
            'pagination' => [
                'current_page' => $reports->currentPage(),
                'last_page' =>$reports->lastPage(),
                'per_page' => $reports->perPage(),
                'total' => $reports->total(),
            ],
        ];
    }
}