/**
 * Friendship Service
 * Handles friend-related API calls
 */

import { api } from "../configs/api";
import type {
    FriendRequest,
    FriendSuggestion,
    Friend,
    BlockedUser,
    FriendUser,
} from "../types/friendship";

type PendingRequestResponseItem = {
    user_id: number;
    username: string;
    profile?: {
        first_name?: string | null;
        last_name?: string | null;
        avatar_url?: string | null;
        bio?: string | null;
    } | null;
    sent_at: string;
};

type FriendsResponseItem = {
    id: number;
    username: string;
    is_verified?: boolean;
    profile?: {
        first_name?: string | null;
        last_name?: string | null;
        avatar_url?: string | null;
        bio?: string | null;
    } | null;
};

const mapUser = (
    user: {
        id: number;
        username: string;
        is_verified?: boolean;
        profile?: {
            first_name?: string | null;
            last_name?: string | null;
            avatar_url?: string | null;
            bio?: string | null;
        } | null;
    },
): FriendUser => ({
    id: user.id,
    username: user.username,
    firstName: user.profile?.first_name || "",
    lastName: user.profile?.last_name || "",
    avatarUrl: user.profile?.avatar_url || null,
    bio: user.profile?.bio || null,
    isVerified: user.is_verified ?? false,
    mutualFriends: 0,
});

/**
 * Get friend suggestions.
 * Backend does not expose this endpoint yet.
 */
export const getFriendSuggestions = async (): Promise<FriendSuggestion[]> => {
    return [];
};

/**
 * Get pending friend requests (received).
 */
export const getFriendRequests = async (): Promise<FriendRequest[]> => {
    const response = await api.get<{ pending_requests: PendingRequestResponseItem[] }>("/friendships/pending");

    return response.data.pending_requests.map((item) => ({
        id: item.user_id,
        user: {
            id: item.user_id,
            username: item.username,
            firstName: item.profile?.first_name || "",
            lastName: item.profile?.last_name || "",
            avatarUrl: item.profile?.avatar_url || null,
            bio: item.profile?.bio || null,
            isVerified: false,
            mutualFriends: 0,
        },
        createdAt: item.sent_at,
    }));
};

/**
 * Get friends list.
 */
export const getFriends = async (): Promise<Friend[]> => {
    const response = await api.get<{ friends: FriendsResponseItem[] }>("/friendships/friends");

    return response.data.friends.map((item) => ({
        friendshipId: item.id,
        user: mapUser(item),
        acceptedAt: new Date().toISOString(),
    }));
};

/**
 * Get blocked users.
 * Backend does not expose this endpoint yet.
 */
export const getBlockedUsers = async (): Promise<BlockedUser[]> => {
    return [];
};

/**
 * Send friend request.
 */
export const sendFriendRequest = async (userId: number): Promise<{ success: boolean }> => {
    await api.post(`/friendships/request/${userId}`);
    return { success: true };
};

/**
 * Accept friend request.
 * Backend expects requester user id.
 */
export const acceptFriendRequest = async (userId: number): Promise<{ success: boolean }> => {
    await api.post(`/friendships/accept/${userId}`);
    return { success: true };
};

/**
 * Decline friend request.
 * Backend expects requester user id.
 */
export const declineFriendRequest = async (userId: number): Promise<{ success: boolean }> => {
    await api.post(`/friendships/reject/${userId}`);
    return { success: true };
};

/**
 * Remove suggestion.
 * Backend does not expose this endpoint yet.
 */
export const removeSuggestion = async (_suggestionId: number): Promise<{ success: boolean }> => {
    return { success: true };
};

/**
 * Unfriend.
 * Backend expects target user id.
 */
export const unfriend = async (userId: number): Promise<{ success: boolean }> => {
    await api.delete(`/friendships/unfriend/${userId}`);
    return { success: true };
};

/**
 * Block user.
 */
export const blockUser = async (userId: number): Promise<{ success: boolean }> => {
    await api.post(`/friendships/block/${userId}`);
    return { success: true };
};

/**
 * Unblock user.
 * Backend expects target user id.
 */
export const unblockUser = async (userId: number): Promise<{ success: boolean }> => {
    await api.delete(`/friendships/unblock/${userId}`);
    return { success: true };
};

export default {
    getFriendSuggestions,
    getFriendRequests,
    getFriends,
    getBlockedUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeSuggestion,
    unfriend,
    blockUser,
    unblockUser,
};
