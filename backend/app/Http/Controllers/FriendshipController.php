<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Friendship;
use App\Models\UserBlock;
use Illuminate\Support\Facades\Auth;

class FriendshipController extends Controller
{

   public function sendRequest(Request $request, $userId)
    {
        $authUser = $request->user();
        $userId = (int) $userId;

        if ($authUser->id === $userId) {
            return response()->json([
                'message' => 'Bạn không thể gửi lời mời kết bạn cho chính mình.'
            ], 422);
        }

        $targetUser = User::find($userId);

        if (!$targetUser) {
            return response()->json([
                'message' => 'Người dùng không tồn tại.'
            ], 404);
        }

        $existing = Friendship::between($authUser->id, $userId)
            ->whereIn('status', ['pending', 'accepted'])
            ->first();

        if ($existing) {
            if ($existing->status === 'accepted') {
                return response()->json([
                    'message' => 'Hai người đã là bạn bè.'
                ], 409);
            }

            return response()->json([
                'message' => 'Lời mời kết bạn đã tồn tại.'
            ], 409);
        }
          if ($authUser->hasBlockedUser($userId) || $authUser->isBlockedBy($userId)) {
            return response()->json([
                'message' => 'Không thể gửi lời mời kết bạn vì có quan hệ chặn.'
            ], 403);
        }
        Friendship::create([
            'requester_id' => $authUser->id,
            'receiver_id'  => $userId,
            'status'       => 'pending',
        ]);

        return response()->json([
            'message' => 'Đã gửi lời mời kết bạn.'
        ], 201);
    }
    public function acceptRequest(Request $request, $userId){
        $authUser = $request->user();
        $friendship = Friendship::where('requester_id', $userId)->where('receiver_id',$authUser->id)->where('status','pending')->first();
        if (!$friendship){
            return response() -> json(['message' => 'Không tìm thấy yêu cầu.'],404);
        }
        $friendship->update([
            'status' => 'accepted',
            'accepted_at' => now()
        ]);
        return response() -> json([
            'message' => 'Lời mời kết bạn đã được chấp nhận.'
        ]);
    }

    public function rejectRequest(Request $request, $userId)
    {
        $authUser = $request->user();

        $friendship = Friendship::where('requester_id', $userId)
            ->where('receiver_id', $authUser->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendship) {
            return response()->json([
                'message' => 'Không tìm thấy yêu cầu kết bạn nào đang chờ xử lý từ người dùng này.'
            ], 404);
        }

        $friendship->delete();

        return response()->json([
            'message' => 'Lời mời kết bạn đã được từ chối.'
        ]);
    }

    public function cancelRequest(Request $request, $userId)
    {
        $authUser = $request->user();

        $friendship = Friendship::where('requester_id', $authUser->id)
            ->where('receiver_id', $userId)
            ->where('status', 'pending')
            ->first();

        if (!$friendship) {
            return response()->json([
                'message' => 'Không tìm thấy yêu cầu lời mời nào.'
            ], 404);
        }

        $friendship->delete();

        return response()->json([
            'message' => 'Lời mời kết bạn đã được gỡ bỏ.'
        ]);
    }

    // ─── Friend Management ─────────────────────────────────────

    /**
     * Hủy kết bạn.
     *
     * Cả hai bên đều có thể unfriend.
     */
    public function unfriend(Request $request, $userId)
    {
        $authUser = $request->user();

        $friendship = Friendship::where('requester_id', $userId)->where('receiver_id',$userId)->where('status','pending')->first();

        if (!$friendship) {
            return response()->json([
                'message' => 'Bạn không phải là bạn bè với người dùng này.'
            ], 404);
        }

        $friendship->delete();

        return response()->json([
            'message' => 'Hủy kết bạn thành công.'
        ]);
    }

    /**
     * Danh sách bạn bè của người dùng hiện tại.
     *
     * Trả về danh sách friends kèm profile.
     */
    public function listFriends(Request $request)
    {
        $authUser = $request->user();

        $friendIds = Friendship::where('status', 'accepted')
            ->where(function ($query) use ($authUser) {
                $query->where('requester_id', $authUser->id)
                    ->orWhere('receiver_id', $authUser->id);
            })
            ->get()
            ->map(function ($friendship) use ($authUser) {
                if ($friendship->requester_id == $authUser->id) {
                    return $friendship->receiver_id;
                }

                return $friendship->requester_id;
            });
        $friends = User::whereIn('id', $friendIds)
            ->with('profile')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'is_verified' => $user->is_verified,
                    'profile' => $user->profile ? [
                        'first_name' => $user->profile->first_name,
                        'last_name' => $user->profile->last_name,
                        'avatar_url' => $user->profile->avatar_url,
                        'bio' => $user->profile->bio,
                    ] : null,
                ];
            })
            ->values();

        return response()->json([
            'friends' => $friends
        ]);
    }

    /**
     * Danh sách lời mời kết bạn đang chờ (incoming).
     */
    public function pendingRequests(Request $request)
    {
        $authUser = $request->user();

        $pending = $authUser->pendingFriendRequestsReceived()
            ->with('requester.profile')
            ->get()
            ->map(function ($friendship) {
                $requester = $friendship->requester;
                return [
                    'user_id'    => $requester->id,
                    'username'   => $requester->username,
                    'profile'    => $requester->profile ? [
                        'first_name' => $requester->profile->first_name,
                        'last_name'  => $requester->profile->last_name,
                        'avatar_url' => $requester->profile->avatar_url,
                    ] : null,
                    'sent_at'    => $friendship->created_at,
                ];
            });

        return response()->json([
            'pending_requests' => $pending,
            'total'            => $pending->count(),
        ]);
    }

    // ─── Block Management ──────────────────────────────────────

    /**
     * Block một user.
     *
     * Nếu đang là bạn bè → tự hủy friendship.
     * Nếu có lời mời pending → tự xóa.
     */
    public function blockUser(Request $request, $userId)
    {
        $authUser = $request->user();

        // Không thể block chính mình
        if ($authUser->id == $userId) {
            return response()->json([
                'message' => 'Bạn không thể chặn chính mình.'
            ], 422);
        }

        // Kiểm tra user đích tồn tại
        $targetUser = User::find($userId);
        if (!$targetUser) {
            return response()->json([
                'message' => 'Người dùng không tồn tại.'
            ], 404);
        }

        // Kiểm tra đã block chưa
        if ($authUser->hasBlockedUser($userId)) {
            return response()->json([
                'message' => 'Người dùng này đã bị chặn.'
            ], 409);
        }

        // Xóa friendship nếu có (pending hoặc accepted)
        Friendship::between($authUser->id, $userId)->delete();

        // Tạo block record
        UserBlock::create([
            'blocker_id' => $authUser->id,
            'blocked_id' => $userId,
        ]);

        return response()->json([
            'message' => 'Đã chặn người dùng thành công.'
        ]);
    }

    /**
     * Unblock một user.
     */
    public function unblockUser(Request $request, $userId)
    {
        $authUser = $request->user();

        $block = UserBlock::where('blocker_id', $authUser->id)
            ->where('blocked_id', $userId)
            ->first();

        if (!$block) {
            return response()->json([
                'message' => 'Người dùng này chưa bị chặn.'
            ], 404);
        }

        $block->delete();

        return response()->json([
            'message' => 'Đã bỏ chặn người dùng thành công.'
        ]);
    }
}
