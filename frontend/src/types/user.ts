/**
 * User Types
 * Types related to user profile and user data
 */

/**
 * API response types from /profile/me
 */
export interface UserProfileApiResponse {
    user: {
        id: number;
        username: string;
        email: string;
        role: string | null;
        is_active: boolean;
        is_verified: boolean;
        last_login: string | null;
        created_at: string;
    };
    profile: {
        first_name: string | null;
        last_name: string | null;
        bio: string | null;
        avatar_url: string | null;
        cover_url: string | null;
        phone: string | null;
        address: string | null;
        birth_date: string | null;
        gender: string | null;
    };
}

export interface UserProfileResponse {
    success: boolean;
    message?: string;
    data: UserProfileApiResponse | null;
}

/**
 * Frontend User interface (transformed from API)
 */
export interface User {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    isVerified?: boolean;
}
