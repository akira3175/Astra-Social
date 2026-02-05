/**
 * Friendship Service
 * Handles friend-related API calls with mock data
 */

import type {
    FriendRequest,
    FriendSuggestion,
    Friend,
    BlockedUser,
    FriendUser
} from "../types/friendship";

// ============ Mock Data ============

const mockUsers: FriendUser[] = [
    {
        id: 101,
        username: "nguyenvana",
        firstName: "Văn A",
        lastName: "Nguyễn",
        avatarUrl: "https://i.pravatar.cc/150?img=1",
        bio: "Yêu thích công nghệ và lập trình",
        isVerified: true,
        mutualFriends: 5,
    },
    {
        id: 102,
        username: "tranthib",
        firstName: "Thị B",
        lastName: "Trần",
        avatarUrl: "https://i.pravatar.cc/150?img=2",
        bio: "Designer | Coffee lover ☕",
        isVerified: false,
        mutualFriends: 3,
    },
    {
        id: 103,
        username: "levanc",
        firstName: "Văn C",
        lastName: "Lê",
        avatarUrl: "https://i.pravatar.cc/150?img=3",
        bio: "Photographer | Travel enthusiast",
        isVerified: true,
        mutualFriends: 8,
    },
    {
        id: 104,
        username: "phamthid",
        firstName: "Thị D",
        lastName: "Phạm",
        avatarUrl: "https://i.pravatar.cc/150?img=4",
        bio: "Music lover 🎵",
        isVerified: false,
        mutualFriends: 2,
    },
    {
        id: 105,
        username: "hovane",
        firstName: "Văn E",
        lastName: "Hồ",
        avatarUrl: "https://i.pravatar.cc/150?img=5",
        bio: "Software Engineer at Tech Corp",
        isVerified: true,
        mutualFriends: 12,
    },
    {
        id: 106,
        username: "dangthif",
        firstName: "Thị F",
        lastName: "Đặng",
        avatarUrl: "https://i.pravatar.cc/150?img=6",
        bio: "Student | Art lover",
        isVerified: false,
        mutualFriends: 1,
    },
    {
        id: 107,
        username: "buivang",
        firstName: "Văn G",
        lastName: "Bùi",
        avatarUrl: "https://i.pravatar.cc/150?img=7",
        bio: "Gamer | Streamer",
        isVerified: false,
        mutualFriends: 4,
    },
    {
        id: 108,
        username: "vuthih",
        firstName: "Thị H",
        lastName: "Vũ",
        avatarUrl: "https://i.pravatar.cc/150?img=8",
        bio: "Bookworm 📚",
        isVerified: true,
        mutualFriends: 6,
    },
];

// Mock state (simulates backend state)
let mockFriends: Friend[] = [
    {
        friendshipId: 1,
        user: mockUsers[0],
        acceptedAt: "2026-01-15T10:30:00Z",
    },
    {
        friendshipId: 2,
        user: mockUsers[1],
        acceptedAt: "2026-01-20T14:45:00Z",
    },
    {
        friendshipId: 3,
        user: mockUsers[2],
        acceptedAt: "2026-02-01T09:15:00Z",
    },
];

let mockRequests: FriendRequest[] = [
    {
        id: 10,
        user: mockUsers[3],
        createdAt: "2026-02-04T08:00:00Z",
    },
    {
        id: 11,
        user: mockUsers[4],
        createdAt: "2026-02-05T12:30:00Z",
    },
];

let mockSuggestions: FriendSuggestion[] = [
    {
        id: 20,
        user: mockUsers[5],
        mutualFriends: 1,
        reason: "Có 1 bạn chung",
    },
    {
        id: 21,
        user: mockUsers[6],
        mutualFriends: 4,
        reason: "Có 4 bạn chung",
    },
    {
        id: 22,
        user: mockUsers[7],
        mutualFriends: 6,
        reason: "Có 6 bạn chung",
    },
];

let mockBlocked: BlockedUser[] = [];

// ============ Helper Functions ============

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ API Functions ============

/**
 * Get friend suggestions
 */
export const getFriendSuggestions = async (): Promise<FriendSuggestion[]> => {
    await delay(500);
    return [...mockSuggestions];
};

/**
 * Get pending friend requests (received)
 */
export const getFriendRequests = async (): Promise<FriendRequest[]> => {
    await delay(500);
    return [...mockRequests];
};

/**
 * Get friends list
 */
export const getFriends = async (): Promise<Friend[]> => {
    await delay(500);
    return [...mockFriends];
};

/**
 * Get blocked users
 */
export const getBlockedUsers = async (): Promise<BlockedUser[]> => {
    await delay(500);
    return [...mockBlocked];
};

/**
 * Send friend request
 */
export const sendFriendRequest = async (userId: number): Promise<{ success: boolean }> => {
    await delay(800);

    // Remove from suggestions
    const suggestionIndex = mockSuggestions.findIndex(s => s.user.id === userId);
    if (suggestionIndex > -1) {
        mockSuggestions.splice(suggestionIndex, 1);
    }

    return { success: true };
};

/**
 * Accept friend request
 */
export const acceptFriendRequest = async (requestId: number): Promise<{ success: boolean }> => {
    await delay(800);

    const requestIndex = mockRequests.findIndex(r => r.id === requestId);
    if (requestIndex > -1) {
        const request = mockRequests[requestIndex];
        // Add to friends
        mockFriends.push({
            friendshipId: Date.now(),
            user: request.user,
            acceptedAt: new Date().toISOString(),
        });
        // Remove from requests
        mockRequests.splice(requestIndex, 1);
    }

    return { success: true };
};

/**
 * Decline friend request
 */
export const declineFriendRequest = async (requestId: number): Promise<{ success: boolean }> => {
    await delay(800);

    const requestIndex = mockRequests.findIndex(r => r.id === requestId);
    if (requestIndex > -1) {
        mockRequests.splice(requestIndex, 1);
    }

    return { success: true };
};

/**
 * Remove suggestion
 */
export const removeSuggestion = async (suggestionId: number): Promise<{ success: boolean }> => {
    await delay(500);

    const index = mockSuggestions.findIndex(s => s.id === suggestionId);
    if (index > -1) {
        mockSuggestions.splice(index, 1);
    }

    return { success: true };
};

/**
 * Unfriend
 */
export const unfriend = async (friendshipId: number): Promise<{ success: boolean }> => {
    await delay(800);

    const index = mockFriends.findIndex(f => f.friendshipId === friendshipId);
    if (index > -1) {
        mockFriends.splice(index, 1);
    }

    return { success: true };
};

/**
 * Block user
 */
export const blockUser = async (userId: number): Promise<{ success: boolean }> => {
    await delay(800);

    // Find and remove from friends
    const friendIndex = mockFriends.findIndex(f => f.user.id === userId);
    if (friendIndex > -1) {
        const friend = mockFriends[friendIndex];
        // Add to blocked
        mockBlocked.push({
            friendshipId: friend.friendshipId,
            user: friend.user,
            blockedAt: new Date().toISOString(),
        });
        // Remove from friends
        mockFriends.splice(friendIndex, 1);
    }

    return { success: true };
};

/**
 * Unblock user
 */
export const unblockUser = async (friendshipId: number): Promise<{ success: boolean }> => {
    await delay(800);

    const index = mockBlocked.findIndex(b => b.friendshipId === friendshipId);
    if (index > -1) {
        mockBlocked.splice(index, 1);
    }

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
