<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Friendship;
use App\Models\UserBlock;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Auth;

class FriendshipController extends Controller
{
    public function __construct(
        private NotificationService $notiService
    ) {}

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

        // Notify the receiver
        $this->notiService->create([
            'receiver_id' => $userId,
            'actor_id'    => $authUser->id,
            'type'        => 'FRIEND_REQ',
            'entity_type' => Notification::ENTITY_TYPE_FRIEND,
            'entity_id'   => $authUser->id,
            'message'     => 'đã gửi lời mời kết bạn cho bạn',
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
        Friendship::where('requester_id', $userId)
            ->where('receiver_id', $authUser->id)
            ->update([
                'status' => 'accepted',
                'accepted_at' => now()
            ]);

        // Notify the original requester that their request was accepted
        $this->notiService->create([
            'receiver_id' => $userId,
            'actor_id'    => $authUser->id,
            'type'        => 'FRIEND_ACCEPT',
            'entity_type' => Notification::ENTITY_TYPE_FRIEND,
            'entity_id'   => $authUser->id,
            'message'     => 'đã chấp nhận lời mời kết bạn của bạn',
        ]);

        return response()->json([
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

        Friendship::where('requester_id', $userId)
            ->where('receiver_id', $authUser->id)
            ->delete();

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

        Friendship::where('requester_id', $authUser->id)
            ->where('receiver_id', $userId)
            ->delete();

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

        $friendship = Friendship::between($authUser->id, $userId)
            ->where('status', 'accepted')
            ->first();

        if (!$friendship) {
            return response()->json([
                'message' => 'Bạn không phải là bạn bè với người dùng này.'
            ], 404);
        }

        Friendship::between($authUser->id, $userId)
            ->where('status', 'accepted')
            ->delete();

        return response()->json([
            'message' => 'Hủy kết bạn thành công.'
        ]);
    }

    /**
     * Trả về trạng thái quan hệ bạn bè giữa auth user và target user.
     * Possible statuses:
     *   none              – Chưa có quan hệ
     *   pending_sent      – Auth user đã gửi lời mời
     *   pending_received  – Target user đã gửi lời mời cho auth user
     *   friends           – Đã là bạn bè
     *   blocked_by_me     – Auth user đã chặn target
     *   blocked_by_them   – Target đã chặn auth user
     */
    public function getStatus(Request $request, $userId)
    {
        $authUser = $request->user();
        $userId   = (int) $userId;

        if ($authUser->id === $userId) {
            return response()->json(['status' => 'self']);
        }

        // Block checks first
        if ($authUser->hasBlockedUser($userId)) {
            return response()->json(['status' => 'blocked_by_me']);
        }
        if ($authUser->isBlockedBy($userId)) {
            return response()->json(['status' => 'blocked_by_them']);
        }

        // Check friendship record
        $friendship = Friendship::between($authUser->id, $userId)->first();

        if (!$friendship) {
            return response()->json(['status' => 'none']);
        }

        if ($friendship->status === 'accepted') {
            return response()->json(['status' => 'friends']);
        }

        // Pending
        if ($friendship->requester_id === $authUser->id) {
            return response()->json(['status' => 'pending_sent']);
        }

        return response()->json(['status' => 'pending_received']);
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

        UserBlock::where('blocker_id', $authUser->id)
            ->where('blocked_id', $userId)
            ->delete();

        return response()->json([
            'message' => 'Đã bỏ chặn người dùng thành công.'
        ]);
    }

    // ─── Friend Suggestions (Facebook-like algorithm) ──────────

    /**
     * Gợi ý bạn bè dựa trên:
     *  1. Mutual friends (bạn chung) — score cao nhất
     *  2. Friends of friends (FoF — 2-hop)
     *  Loại trừ: chính mình, bạn bè hiện tại, blocked, pending requests.
     */
    public function getSuggestions(Request $request)
    {
        $authUser = $request->user();
        $limit = (int) $request->query('limit', 10);

        // 1. Lấy danh sách friend IDs hiện tại
        $friendIds = Friendship::where('status', 'accepted')
            ->where(function ($q) use ($authUser) {
                $q->where('requester_id', $authUser->id)
                  ->orWhere('receiver_id', $authUser->id);
            })
            ->get()
            ->map(fn($f) => $f->requester_id == $authUser->id ? $f->receiver_id : $f->requester_id)
            ->values()
            ->toArray();

        // 2. Lấy danh sách blocked IDs (cả 2 chiều)
        $blockedByMe = UserBlock::where('blocker_id', $authUser->id)->pluck('blocked_id')->toArray();
        $blockedMe   = UserBlock::where('blocked_id', $authUser->id)->pluck('blocker_id')->toArray();

        // 3. Lấy pending request IDs
        $pendingIds = Friendship::where('status', 'pending')
            ->where(function ($q) use ($authUser) {
                $q->where('requester_id', $authUser->id)
                  ->orWhere('receiver_id', $authUser->id);
            })
            ->get()
            ->map(fn($f) => $f->requester_id == $authUser->id ? $f->receiver_id : $f->requester_id)
            ->values()
            ->toArray();

        // Tập các ID cần loại trừ
        $excludeIds = array_unique(array_merge(
            [$authUser->id],
            $friendIds,
            $blockedByMe,
            $blockedMe,
            $pendingIds
        ));

        // 4. Tìm Friends-of-Friends (FoF) và đếm mutual friends
        //    Với mỗi friend, lấy danh sách friend của họ → tính mutual count
        $mutualCounts = [];

        foreach ($friendIds as $fid) {
            $fofIds = Friendship::where('status', 'accepted')
                ->where(function ($q) use ($fid) {
                    $q->where('requester_id', $fid)
                      ->orWhere('receiver_id', $fid);
                })
                ->get()
                ->map(fn($f) => $f->requester_id == $fid ? $f->receiver_id : $f->requester_id)
                ->values()
                ->toArray();

            foreach ($fofIds as $fofId) {
                if (in_array($fofId, $excludeIds)) continue;
                $mutualCounts[$fofId] = ($mutualCounts[$fofId] ?? 0) + 1;
            }
        }

        // 5. Sắp xếp theo mutual count giảm dần
        arsort($mutualCounts);
        $suggestedIds = array_slice(array_keys($mutualCounts), 0, $limit);

        // 6. Nếu chưa đủ, bổ sung random users
        if (count($suggestedIds) < $limit) {
            $remaining = $limit - count($suggestedIds);
            $allExclude = array_unique(array_merge($excludeIds, $suggestedIds));

            $randomUsers = User::whereNotIn('id', $allExclude)
                ->inRandomOrder()
                ->limit($remaining)
                ->pluck('id')
                ->toArray();

            $suggestedIds = array_merge($suggestedIds, $randomUsers);
        }

        // 7. Fetch user data
        $users = User::whereIn('id', $suggestedIds)
            ->with('profile')
            ->get()
            ->map(function ($user) use ($mutualCounts) {
                return [
                    'id'           => $user->id,
                    'username'     => $user->username,
                    'is_verified'  => $user->is_verified,
                    'mutual_count' => $mutualCounts[$user->id] ?? 0,
                    'profile'      => $user->profile ? [
                        'first_name'  => $user->profile->first_name,
                        'last_name'   => $user->profile->last_name,
                        'avatar_url'  => $user->profile->avatar_url,
                        'bio'         => $user->profile->bio,
                    ] : null,
                ];
            })
            ->sortByDesc('mutual_count')
            ->values();

        return response()->json([
            'success'     => true,
            'suggestions' => $users,
        ]);
    }

    // ─── Blocked Users List ────────────────────────────────────

    /**
     * Lấy danh sách người dùng đã bị chặn bởi auth user.
     */
    public function getBlockedUsers(Request $request)
    {
        $authUser = $request->user();
        $limit = (int) $request->query('limit', 20);

        $blockedIds = UserBlock::where('blocker_id', $authUser->id)
            ->pluck('blocked_id');

        $users = User::whereIn('id', $blockedIds)
            ->with('profile')
            ->paginate($limit);

        $data = $users->map(function ($user) {
            return [
                'id'          => $user->id,
                'username'    => $user->username,
                'is_verified' => $user->is_verified,
                'profile'     => $user->profile ? [
                    'first_name'  => $user->profile->first_name,
                    'last_name'   => $user->profile->last_name,
                    'avatar_url'  => $user->profile->avatar_url,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
            'meta'    => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'total'        => $users->total(),
            ],
        ]);
    }
}
