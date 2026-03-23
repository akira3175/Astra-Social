<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\User;
use App\Models\Post; 
use App\Models\Comment; 
use Illuminate\Support\Facades\DB;

class NotiController extends Controller{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        $userId = auth()->id() ?? $request->input('user_id');
        $limit = $request->input('limit', 10);

        $data = Notification::where('receiver_id', (int)$userId)
                            ->with('actor.profile') 
                            ->orderBy('created_at', 'desc')
                            ->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $data->items(),
            'meta' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'total' => $data->total(),
            ],
        ]);
    }

    public function getByIsRead(Request $request) {
        $userId = auth()->id() ?? $request->input('user_id');
        $isRead = $request->input('is_read', false);

        $count = Notification::where([
            'receiver_id' => (int)$userId,
            'is_read' => filter_var($isRead, FILTER_VALIDATE_BOOLEAN)
        ])->count();

        return response()->json([
            'success' => true,
            'data' => $count,
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
    public function markAsRead($id) {
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy thông báo'], 404);
        }

        $notification->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Đã đánh dấu đọc'
        ]);
    }

    public function markAllAsRead() {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['success' => false, 'message' => 'Bạn chưa đăng nhập'], 401);
        }

        Notification::where('receiver_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Đã đánh dấu tất cả là đã đọc'
        ]);
    }

    public static function notifyLike($actorId, $receiverId, $entityType, $entityId) {
        if ($actorId == $receiverId) return;

        $actor = User::find($actorId);
        if (!$actor) return;

        $existingNoti = Notification::where('receiver_id', $receiverId)
            ->where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->where('is_read', false)
            ->where('message', 'LIKE', '%thích%')
            ->first();

        $table = ($entityType === 'POST') ? 'post_likes' : 'comment_likes';
        $column = ($entityType === 'POST') ? 'post_id' : 'comment_id';
        $likesCount = DB::table($table)->where($column, $entityId)->count();

        if ($existingNoti) {
            if ($likesCount > 1) {
                $othersCount = $likesCount - 1;
                $message = "{$actor->username} và {$othersCount} người khác đã thích " . ($entityType === 'POST' ? 'bài viết' : 'bình luận') . " của bạn.";
            } else {
                $message = "{$actor->username} đã thích " . ($entityType === 'POST' ? 'bài viết' : 'bình luận') . " của bạn.";
            }

            $existingNoti->update([
                'actor_id' => $actorId, // Cập nhật người gây hành động mới nhất
                'message' => $message,
                'updated_at' => now()
            ]);
        } else {
            Notification::create([
                'receiver_id' => $receiverId,
                'actor_id' => $actorId,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'message' => "{$actor->username} đã thích " . ($entityType === 'POST' ? 'bài viết' : 'bình luận') . " của bạn.",
                'is_read' => false
            ]);
        }
    }

    public static function notifyComment($actorId, $commentId) {
        $comment = Comment::with('post')->find($commentId);
        if (!$comment) return;

        $actor = User::find($actorId);

        if ($comment->parent_id) {
            $parentComment = Comment::find($comment->parent_id);
            if ($parentComment && $parentComment->user_id != $actorId) {
                Notification::create([
                    'receiver_id' => $parentComment->user_id,
                    'actor_id' => $actorId,
                    'entity_type' => 'COMMENT',
                    'entity_id' => $comment->id,
                    'message' => "{$actor->username} đã trả lời bình luận của bạn."
                ]);
            }
        } 
        else {
            $post = $comment->post;
            if ($post && $post->user_id != $actorId) {
                Notification::create([
                    'receiver_id' => $post->user_id,
                    'actor_id' => $actorId,
                    'entity_type' => 'POST',
                    'entity_id' => $post->id,
                    'message' => "{$actor->username} đã bình luận về bài viết của bạn."
                ]);
            }
        }
    }
}
