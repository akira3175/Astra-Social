<?php
namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Models\Report;
use App\Models\Post;
use App\Services\Comment;

class NotificationService{

    public function notifyResolvedReport(int $userId, array $data){
        $result = Notification::create([
            'receiver_id' => $data['target_author_id'],
            'actor_id' => $userId,
            'entity_type' => $data['target_type'],
            'entity_id' => $data['target_id'],
            'message' =>  $data['reason'],
        ]);

        if($data['target_type']===Report::TARGET_TYPE_POST){
            $result->update([
                'message'=>'Bài viết của bạn đã bị gỡ bỏ do '.$data['reason'],
            ]);
            Post::find($data['target_id'])->delete();
        }
        
        else if($data['target_type']===Report::TARGET_TYPE_COMMENT){
            $result->update([
                'message'=>'Bình luận của bạn đã bị gỡ bỏ do '.$data['reason'],
            ]);
            User::find($data['target_id'])->delete();
        }

        else if($data['target_type']===Report::TARGET_TYPE_USER){
            $result->update([
                'message'=>'Tài khoản của bạn đã bị khóa do '.$data['reason'],
            ]);            
            Comment::find($data['target_id'])->delete();
        }
        return [
            'success' => true,
            'data' => $data,
        ];
    }

    public function create(array $noti){
        try{
            $result = Notification::create([
                'receiver_id'=>$noti['receiver_id'],
                'actor_id'=>$noti['actor_id'],
                'entity_type'=>$noti['entity_type'],
                'entity_id'=>$noti['entity_id'],
                'message'=> $noti['message'],
            ]);
            return true;
        }
        catch (Exception $e) {
            return false;
        }
    }
}