<?php
namespace App\Services;

use App\Models\MediaAttachment;
use App\Models\Report;
use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use App\Services\NotificationService;

class ReportService{
    public function __construct(
        private NotificationService $notiService
    ){}


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

    public function getReports(int $page,
            int $perPage = 10,
            string $targetType = 'ALL',
            string $status = 'ALL',
            string $search = '',
        ){

        $query = Report::query();

        if (trim($search)!=='' ){
            $query = $query->where('reason', 'like', '%' . $search . '%');
        }
        if ($targetType!=='ALL'){
            $query = $query->where('target_type', $targetType);
        }
        if ($status!=='ALL'){
            $query = $query->where('status', $status);
        }

        $reports = $query->with(['reporter', 'target_author'])
                        ->orderBy('id', 'desc')
                        ->paginate($perPage, ['*'], 'page', $page);
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

    public function handleStatus (int $id, string $status, int $userId){
        $query = Report::find( $id);
        if ($status!==Report::STATUS_RESOLVED &&
            $status!==Report::STATUS_REJECTED ||
            $query->status === $status
        ){
            return [
                'success' => false,
                'report' => $query,
            ];

        }

        $query->update(['status' => $status]);
        if ($query->status===Report::STATUS_RESOLVED){
            $this->notiService->notifyResolvedReport($userId, $query->toArray());
        }
        return [
            'success' => true,
            'report' => $query,
        ];
    }
}