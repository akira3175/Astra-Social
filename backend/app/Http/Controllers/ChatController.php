<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\ConversationMember;
use App\Models\Message;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    // Gửi tin nhắn
    public function sendPrivateMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $senderId = $request->user()->id;
        $receiverId = $request->receiver_id;

        return DB::transaction(function () use ($senderId, $receiverId, $request) {
            // Tìm hội thoại PRIVATE chung giữa 2 người
            $conversation = Conversation::where('type', 'PRIVATE')
                ->whereHas('members', fn($q) => $q->where('user_id', $senderId))
                ->whereHas('members', fn($q) => $q->where('user_id', $receiverId))
                ->first();

            // Nếu chưa có thì tạo mới
            if (!$conversation) {
                $conversation = Conversation::create([
                    'type' => 'PRIVATE',
                    'last_message_at' => now(),
                ]);

                ConversationMember::insert([
                    ['conversation_id' => $conversation->id, 'user_id' => $senderId, 'role' => 'MEMBER', 'created_at' => now(), 'updated_at' => now()],
                    ['conversation_id' => $conversation->id, 'user_id' => $receiverId, 'role' => 'MEMBER', 'created_at' => now(), 'updated_at' => now()],
                ]);
            } else {
                $conversation->update(['last_message_at' => now()]);
            }

            //  Lưu tin nhắn
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $senderId,
                'content' => $request->content,
            ]);

            return response()->json(['message' => 'Đã gửi tin nhắn', 'data' => $message]);
        });
    }

    //Tạo nhóm chat
    public function createGroup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'member_ids' => 'required|array',
            'member_ids.*' => 'exists:users,id'
        ]);

        $creatorId = $request->user()->id;

        return DB::transaction(function () use ($creatorId, $request) {
            //  Tạo Conversation
            $conversation = Conversation::create([
                'name' => $request->name,
                'type' => 'GROUP',
                'last_message_at' => now(),
            ]);

            //  Insert Admin
            $membersData = [
                ['conversation_id' => $conversation->id, 'user_id' => $creatorId, 'role' => 'ADMIN', 'created_at' => now(), 'updated_at' => now()]
            ];

            // Insert Members
            foreach (array_unique($request->member_ids) as $memberId) {
                if ($memberId != $creatorId) {
                    $membersData[] = ['conversation_id' => $conversation->id, 'user_id' => $memberId, 'role' => 'MEMBER', 'created_at' => now(), 'updated_at' => now()];
                }
            }
            ConversationMember::insert($membersData);

            $creatorName = $request->user()->username;
            Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $creatorId,
                'content' => "{$creatorName} đã tạo nhóm: " . $request->name,
            ]);
            return response()->json(['message' => 'Tạo nhóm thành công', 'data' => $conversation]);
        });
    }

    //Nhắn tin trong nhóm
    public function sendGroupMessage(Request $request, $conversationId)
    {
        $request->validate(['content' => 'required|string']);
        $userId = $request->user()->id;

        //Kiểm tra User có phải là thành viên không
        $isMember = ConversationMember::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->exists();

        if (!$isMember) {
            return response()->json(['error' => 'Bạn không thuộc nhóm này'], 403);
        }

        return DB::transaction(function () use ($conversationId, $userId, $request) {
            // 2 & 3. Insert tin nhắn và update last_message_at
            $message = Message::create([
                'conversation_id' => $conversationId,
                'sender_id' => $userId,
                'content' => $request->content,
            ]);

            Conversation::where('id', $conversationId)->update(['last_message_at' => now()]);

            return response()->json(['message' => 'Đã gửi tin nhắn nhóm', 'data' => $message]);
        });
    }

    //Đổi tên nhóm 
    public function renameGroup(Request $request, $conversationId)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $userId = $request->user()->id;

        $member = ConversationMember::where('conversation_id', $conversationId)
            ->where('user_id', $userId)->first();

        if (!$member) return response()->json(['error' => 'Không có quyền truy cập'], 403);

        return DB::transaction(function () use ($conversationId, $userId, $request) {
            Conversation::where('id', $conversationId)->update(['name' => $request->name, 'last_message_at' => now()]);

            Message::create([
                'conversation_id' => $conversationId,
                'sender_id' => $userId,
                'content' => "[Hệ thống] Đã đổi tên nhóm thành: " . $request->name,
            ]);

            return response()->json(['message' => 'Đổi tên thành công']);
        });
    }

    // Rời nhóm
    public function leaveGroup(Request $request, $conversationId)
    {
        $userId = $request->user()->id;

        return DB::transaction(function () use ($conversationId, $userId) {
            $member = ConversationMember::where('conversation_id', $conversationId)->where('user_id', $userId)->first();
            if (!$member) return response()->json(['error' => 'Không tìm thấy thành viên'], 404);

            $wasAdmin = $member->role === 'ADMIN';
            $member->delete(); // 

            Message::create([
                'conversation_id' => $conversationId,
                'sender_id' => $userId,
                'content' => "[Hệ thống] Đã rời nhóm",
            ]);

            //  Logic xử lý Admin rời nhóm
            if ($wasAdmin) {
                $adminCount = ConversationMember::where('conversation_id', $conversationId)->where('role', 'ADMIN')->count();
                
                if ($adminCount === 0) {
                    // Tìm member ngẫu nhiên để lên Admin
                    $newAdmin = ConversationMember::where('conversation_id', $conversationId)->first();
                    if ($newAdmin) {
                        $newAdmin->update(['role' => 'ADMIN']);
                        Message::create([
                            'conversation_id' => $conversationId,
                            'sender_id' => $userId, 
                            'content' => "[Hệ thống] Đã tự động chỉ định Admin mới",
                        ]);
                    } else {
                        // Nhóm không còn ai -> Xóa nhóm
                        Conversation::where('id', $conversationId)->delete();
                    }
                }
            }

            return response()->json(['message' => 'Đã rời nhóm']);
        });
    }

    //  Quy trình Thêm Admin nhóm 
    public function addAdmin(Request $request, $conversationId)
    {
        $request->validate(['user_id' => 'required|exists:users,id']);
        $actorId = $request->user()->id;
        $targetId = $request->user_id;

        $actor = ConversationMember::where('conversation_id', $conversationId)->where('user_id', $actorId)->first();
        if (!$actor || $actor->role !== 'ADMIN') {
            return response()->json(['error' => 'Chỉ Admin mới có quyền này'], 403);
        }

        return DB::transaction(function () use ($conversationId, $actorId, $targetId) {
            ConversationMember::where('conversation_id', $conversationId)
                ->where('user_id', $targetId)
                ->update(['role' => 'ADMIN']);

            Message::create([
                'conversation_id' => $conversationId,
                'sender_id' => $actorId,
                'content' => "[Hệ thống] Đã cấp quyền Admin cho một thành viên",
            ]);

            return response()->json(['message' => 'Đã thêm Admin thành công']);
        });
    }

    //  Xóa thành viên
    public function removeMember(Request $request, $conversationId, $targetId)
    {
        $actorId = $request->user()->id;

        $actor = ConversationMember::where('conversation_id', $conversationId)->where('user_id', $actorId)->first();
        if (!$actor || $actor->role !== 'ADMIN') {
            return response()->json(['error' => 'Chỉ Admin mới có quyền xóa'], 403);
        }

        $target = ConversationMember::where('conversation_id', $conversationId)->where('user_id', $targetId)->first();
        if (!$target || $target->role === 'ADMIN') {
            return response()->json(['error' => 'Không thể xóa Admin khác'], 403);
        }

        return DB::transaction(function () use ($conversationId, $actorId, $target) {
            $target->delete();

            Message::create([
                'conversation_id' => $conversationId,
                'sender_id' => $actorId,
                'content' => "[Hệ thống] Đã xóa một thành viên khỏi nhóm",
            ]);

            return response()->json(['message' => 'Đã xóa thành viên']);
        });
    }
//Lấy danh sách hội thoại của người dùng hiện tại
    public function getConversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::whereHas('members', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->with(['members.user', 'messages' => function ($query) {
            $query->latest()->first(); // Lấy tin nhắn mới nhất để hiện preview
        }])
        ->orderBy('last_message_at', 'desc')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $conversations
        ]);
    }
//Lấy danh sách tin nhắn trong một hội thoại
    public function getMessages($conversationId)
    {
        $messages = Message::where('conversation_id', $conversationId)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }
}