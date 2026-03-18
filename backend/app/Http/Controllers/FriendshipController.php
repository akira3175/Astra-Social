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

        if ($authUser->id == $userId) {
            return response()->json([
                'message' => 'You cannot send a friend request to yourself.'
            ], 422);
        }

        $targetUser = User::find($userId);
        if (!$targetUser) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        if ($authUser->hasBlockedUser($userId) || $authUser->isBlockedBy($userId)) {
            return response()->json([
                'message' => 'Cannot send friend request. User is blocked.'
            ], 403);
        }

        // Kiểm tra đã có friendship (pending hoặc accepted)
        $existing = Friendship::between($authUser->id, $userId)
            ->whereIn('status', ['pending', 'accepted'])
            ->first();

        if ($existing) {
            if ($existing->status === 'accepted') {
                return response()->json([
                    'message' => 'You are already friends with this user.'
                ], 409);
            }
            return response()->json([
                'message' => 'A friend request already exists between you and this user.'
            ], 409);
        }

        Friendship::create([
            'requester_id' => $authUser->id,
            'receiver_id'  => $userId,
            'status'       => 'pending',
        ]);

        return response()->json([
            'message' => 'Friend request sent successfully.'
        ], 201);
    }

    /**
     * Chấp nhận lời mời kết bạn.
     *
     * Chỉ receiver mới có quyền accept.
     */
    public function acceptRequest(Request $request, $userId)
    {
        $authUser = $request->user();

        $friendship = Friendship::where('requester_id', $userId)
            ->where('receiver_id', $authUser->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendship) {
            return response()->json([
                'message' => 'No pending friend request found from this user.'
            ], 404);
        }

        $friendship->update([
            'status'      => 'accepted',
            'accepted_at' => now(),
        ]);

        return response()->json([
            'message' => 'Friend request accepted.'
        ]);
    }

    /**
     * Từ chối lời mời kết bạn.
     *
     * Chỉ receiver mới có quyền reject. Lời mời bị xóa khỏi hệ thống.
     */
    public function rejectRequest(Request $request, $userId)
    {
        $authUser = $request->user();

        $friendship = Friendship::where('requester_id', $userId)
            ->where('receiver_id', $authUser->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendship) {
            return response()->json([
                'message' => 'No pending friend request found from this user.'
            ], 404);
        }

        $friendship->delete();

        return response()->json([
            'message' => 'Friend request rejected.'
        ]);
    }

    /**
     * Hủy lời mời kết bạn đã gửi.
     *
     * Chỉ requester mới có quyền cancel.
     */
    public function cancelRequest(Request $request, $userId)
    {
        $authUser = $request->user();

        $friendship = Friendship::where('requester_id', $authUser->id)
            ->where('receiver_id', $userId)
            ->where('status', 'pending')
            ->first();

        if (!$friendship) {
            return response()->json([
                'message' => 'No pending friend request found to cancel.'
            ], 404);
        }

        $friendship->delete();

        return response()->json([
            'message' => 'Friend request cancelled.'
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

        $friendship = Friendship::accepted()
            ->between($authUser->id, $userId)
            ->first();

        if (!$friendship) {
            return response()->json([
                'message' => 'You are not friends with this user.'
            ], 404);
        }

        $friendship->delete();

        return response()->json([
            'message' => 'Unfriended successfully.'
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

        $friends = $authUser->friends()
            ->with('profile')
            ->get()
            ->map(function ($friend) {
                return [
                    'id'         => $friend->id,
                    'username'   => $friend->username,
                    'profile'    => $friend->profile ? [
                        'first_name' => $friend->profile->first_name,
                        'last_name'  => $friend->profile->last_name,
                        'avatar_url' => $friend->profile->avatar_url,
                        'bio'        => $friend->profile->bio,
                    ] : null,
                ];
            });

        // Loại bỏ các user đã bị block
        $blockedIds = $authUser->blockedUsers()->pluck('blocked_id')->toArray();
        $friends = $friends->filter(function ($friend) use ($blockedIds) {
            return !in_array($friend['id'], $blockedIds);
        })->values();

        return response()->json([
            'friends' => $friends,
            'total'   => $friends->count(),
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
                'message' => 'You cannot block yourself.'
            ], 422);
        }

        // Kiểm tra user đích tồn tại
        $targetUser = User::find($userId);
        if (!$targetUser) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        // Kiểm tra đã block chưa
        if ($authUser->hasBlockedUser($userId)) {
            return response()->json([
                'message' => 'User is already blocked.'
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
            'message' => 'User blocked successfully.'
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
                'message' => 'This user is not blocked.'
            ], 404);
        }

        $block->delete();

        return response()->json([
            'message' => 'User unblocked successfully.'
        ]);
    }
}
