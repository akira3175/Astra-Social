<?php
namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\Comment;
use App\Models\Notification;
use App\Services\NotificationService;
use App\Models\User;

class CommentService{
    public function __construct(
        private NotificationService $notiService 
    ){}

    public function getComments(array $params){
        $result = Comment::query()
                ->with(['post', 'user', 'parent'])
                ->orderBy('created_at', 'desc');
        if(empty($result)){
            return false;
        }
        if(strtolower($params['type'])==='root'){
            $result->whereNull('parent_id');            
        }
        else if(strtolower($params['type'])==='reply'){
            $result->whereNotNull('parent_id');
        }
        if(!empty($params['search'])){
            $result->where('content', 'like', '%'.strtolower($params['search']).'%' );
        }
        return $result->paginate(10);
    }

    public function destroy(User $auth_user, string $id){
        $comment = Comment::find($id);
        if(empty($comment)){
            return false;
        }
        $comment->delete();
        $noti=[
            'receiver_id'=>$comment->user_id,
            'actor_id'=>$auth_user->id,
            'entity_type'=> Notification::ENTITY_TYPE_COMMENT,
            'entity_id'=>$id,
            'message'=>'Bình luận của bạn đã bị gỡ bỏ',
        ];
        $result = $this->notiService->create($noti);
        return $result;
    }

    public function adminGetCountByDays(int $days){
        $count = Comment::select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as total')
                )
                ->where('created_at', '>=', now()->subDays($days))
                ->groupBy('date')
                ->get();
        return $count;
    }
}