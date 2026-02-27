<?php
namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Models\Report;
use App\Services\PostService;
// use App\Services\CommentService;
// use App\Services\UserService;

class NotificationService{
    public function __construct(
        private PostService $postService,
        // private CommentService $commentService,
        // private UserService $userService
    ){}

    public function notifyResolvedReport(int $userId, array $data){
        $result = Notification::create([
            'receiver_id' => $data['target_author_id'],
            'actor_id' => $userId,
            'entity_type' => $data['target_type'],
            'entity_id' => $data['target_id'],
            'message' =>  $data['target_preview'],
        ]);

        if($data['target_type']===Report::TARGET_TYPE_POST){
            $result->update([
                'message'=>'Bài viết của bạn đã bị gỡ bỏ do '.$data['target_preview'],
            ]);
            // $this->postService->deletePost($result->entity_id, $result->receiver_id);
        }
        else if($data['target_type']===Report::TARGET_TYPE_COMMENT){
            $result->update([
                'message'=>'Bình luận của bạn đã bị gỡ bỏ do '.$data['target_preview'],
            ]);
            // $this->commentService->deleteComment($result->entity_id, $result->receiver_id);
        }
        else if($data['target_type']===Report::TARGET_TYPE_USER){
            $result->update([
                'message'=>'Tài khoản của bạn đã bị khóa do '.$data['target_preview'],
            ]);            
            // $this->userService->deleteUser($result->entity_id, $result->receiver_id);
        }
        return [
            'success' => true,
            'data' => $data,
        ];
    }
}