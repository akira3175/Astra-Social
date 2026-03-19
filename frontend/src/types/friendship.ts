/**
 * Friendship Types
 * Types related to friendship, friend requests, and blocking
 */

/**
 * Friendship status enum
 */
export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED';

/**
 * Friendship relationship data
 */
export interface Friendship {
    id: number;
    requesterId: number;
    receiverId: number;
    status: FriendshipStatus;
    createdAt: string;
    acceptedAt?: string;
}

/**
 * Friend user data (simplified user info for friend lists)
 */
export interface FriendUser {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    bio: string | null;
    isVerified?: boolean;
    mutualFriends?: number;
}

/**
 * Friend request with user data
 */
export interface FriendRequest {
    id: number;
    user: FriendUser;
    createdAt: string;
}

/**
 * Friend suggestion with user data
 */
export interface FriendSuggestion {
    id: number;
    user: FriendUser;
    mutualFriends: number;
    reason?: string;
}

/**
 * Friend with user data
 */
export interface Friend {
    friendshipId: number;
    user: FriendUser;
    acceptedAt: string;
}

/**
 * Blocked user with user data
 */
export interface BlockedUser {
    friendshipId: number;
    user: FriendUser;
    blockedAt: string;
}
