import { api } from "../configs/api";
import type { UserProfileResponse } from "../types/user";
import { transformUserProfile } from "./userService";

/**
 * Profile Service
 * Handles profile-related API calls
 */

// ============ Endpoints ============

const ENDPOINTS = {
    PROFILE: "/profile",
    PROFILE_ME: "/profile/me",
} as const;

// ============ API Functions ============

/**
 * Get user profile by ID
 */
export const getProfileById = async (userId: number | string) => {
    const response = await api.get<UserProfileResponse>(`${ENDPOINTS.PROFILE}/${userId}`);

    if (response.data.success && response.data.data) {
        return transformUserProfile(response.data.data);
    }

    throw new Error(response.data.message || "Failed to get profile");
};

/**
 * Upload avatar image
 */
export const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post<UserProfileResponse>(`${ENDPOINTS.PROFILE_ME}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (response.data.success && response.data.data) {
        return transformUserProfile(response.data.data);
    }

    throw new Error(response.data.message || "Failed to upload avatar");
};

/**
 * Upload cover image
 */
export const uploadCover = async (file: File, position?: number) => {
    const formData = new FormData();
    formData.append("cover", file);
    if (position !== undefined) {
        formData.append("position", String(position));
    }

    const response = await api.post<UserProfileResponse>(`${ENDPOINTS.PROFILE_ME}/cover`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (response.data.success && response.data.data) {
        return transformUserProfile(response.data.data);
    }

    throw new Error(response.data.message || "Failed to upload cover");
};

/**
 * Update cover position only
 */
export const updateCoverPosition = async (position: number) => {
    const response = await api.patch<UserProfileResponse>(ENDPOINTS.PROFILE_ME, {
        cover_position: position,
    });

    if (response.data.success && response.data.data) {
        return transformUserProfile(response.data.data);
    }

    throw new Error(response.data.message || "Failed to update cover position");
};

export default {
    getProfileById,
    uploadAvatar,
    uploadCover,
    updateCoverPosition,
};

