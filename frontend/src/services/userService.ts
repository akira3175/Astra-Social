import { api } from "../configs/api";
import type { UserProfileApiResponse, UserProfileResponse } from "../types/user";

/**
 * User Service
 * Handles user-related API calls
 */

// ============ Endpoints ============

const ENDPOINTS = {
    PROFILE_ME: "/profile/me",
} as const;

// ============ API Functions ============

/**
 * Get current user profile
 */
export const getMyProfile = async (): Promise<UserProfileResponse> => {
    const response = await api.get<UserProfileResponse>(ENDPOINTS.PROFILE_ME);
    return response.data;
};

/**
 * Transform API user data to frontend User format
 * API returns { user: {...}, profile: {...} }
 */
export const transformUserProfile = (data: UserProfileApiResponse) => ({
    id: String(data.user.id),
    email: data.user.email,
    username: data.user.username,
    firstName: data.profile.first_name || undefined,
    lastName: data.profile.last_name || undefined,
    avatar: data.profile.avatar_url || undefined,
    bio: data.profile.bio || undefined,
    isVerified: data.user.is_verified,
});

export default {
    getMyProfile,
    transformUserProfile,
};
