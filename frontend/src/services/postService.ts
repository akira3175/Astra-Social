import { api } from "../configs/api";
import type { PostsResponse, PostResponse, CreatePostPayload, UpdatePostPayload } from "../types/post";

/**
 * Post Service
 * Handles post-related API calls
 */

// ============ Endpoints ============

const ENDPOINTS = {
    POSTS: "/posts",
    MY_POSTS: "/posts/me",
    POST_BY_ID: (id: number) => `/posts/${id}`,
} as const;

// ============ API Functions ============

/**
 * Get current user's posts (requires auth)
 */
export const getMyPosts = async (
    page: number = 1,
    perPage: number = 10
): Promise<PostsResponse> => {
    const response = await api.get<PostsResponse>(ENDPOINTS.MY_POSTS, {
        params: { page, per_page: perPage },
    });
    return response.data;
};

/**
 * Get public posts feed
 */
export const getPosts = async (
    page: number = 1,
    perPage: number = 10
): Promise<PostsResponse> => {
    const response = await api.get<PostsResponse>(ENDPOINTS.POSTS, {
        params: { page, per_page: perPage },
    });
    return response.data;
};

/**
 * Get a single post by ID
 */
export const getPostById = async (id: number): Promise<PostResponse> => {
    const response = await api.get<PostResponse>(ENDPOINTS.POST_BY_ID(id));
    return response.data;
};

/**
 * Create a new post with optional file attachments
 * Uses FormData for file upload
 */
export const createPost = async (
    payload: CreatePostPayload
): Promise<PostResponse> => {
    const formData = new FormData();

    if (payload.content) {
        formData.append("content", payload.content);
    }

    if (payload.privacy) {
        formData.append("privacy", payload.privacy);
    }

    if (payload.files && payload.files.length > 0) {
        payload.files.forEach((file) => {
            formData.append("files[]", file);
        });
    }

    const response = await api.post<PostResponse>(ENDPOINTS.POSTS, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

/**
 * Update a post (content and privacy only, files cannot be changed)
 */
export const updatePost = async (
    id: number,
    payload: UpdatePostPayload
): Promise<PostResponse> => {
    const response = await api.patch<PostResponse>(ENDPOINTS.POST_BY_ID(id), payload);
    return response.data;
};

/**
 * Delete a post and its attachments
 */
export const deletePost = async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(ENDPOINTS.POST_BY_ID(id));
    return response.data;
};

export default {
    getMyPosts,
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};
