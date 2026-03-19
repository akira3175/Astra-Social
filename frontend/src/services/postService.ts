import { api } from "../configs/api";
import type {
    PostsResponse,
    PostResponse,
    CreatePostPayload,
    UpdatePostPayload,
} from "../types/post";

// ============ Types ============

export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    parent_id: number | null;
    content: string;
    likes_count?: number;
    created_at: string;
    user: {
        id: number;
        username: string;
        profile?: {
            first_name?: string;
            last_name?: string;
            avatar_url?: string;
        };
    };
    replies?: Comment[];
}

export interface CommentsResponse {
    success: boolean;
    data: Comment[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface ToggleLikeResponse {
    success: boolean;
    data: { liked: boolean };
}

// ============ Endpoints ============

const ENDPOINTS = {
    POSTS: "/posts",
    MY_POSTS: "/posts/me",
    POST_BY_ID: (id: number) => `/posts/${id}`,
    POSTS_BY_USER: (userId: number) => `/users/${userId}/posts`,
    HASHTAG_POSTS: (name: string) => `/hashtags/${name}`,
    SEARCH_HASHTAGS: "/hashtags/search",
    TRENDING_HASHTAGS: "/hashtags/trending",
    POST_LIKE: (postId: number) => `/posts/${postId}/like`,
    POST_COMMENTS: (postId: number) => `/posts/${postId}/comments`,
    POST_SHARE: (postId: number) => `/posts/${postId}/share`,
    COMMENT_LIKE: (commentId: number) => `/comments/${commentId}/like`,
    USER_POSTS: (userId: number | string) => `/users/${userId}/posts`,
} as const;

// ============ Post API ============

/**
 * Get the authenticated user's posts
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
 * Get posts by a specific user ID
 */
export const getPostsByUserId = async (
    userId: number | string,
    page: number = 1,
    perPage: number = 10
): Promise<PostsResponse> => {
    const response = await api.get<PostsResponse>(ENDPOINTS.USER_POSTS(userId), {
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

export const getPostsByUser = async (
    userId: number,
    page: number = 1,
    perPage: number = 10
): Promise<PostsResponse> => {
    const response = await api.get<PostsResponse>(ENDPOINTS.POSTS_BY_USER(userId), {
        params: { page, per_page: perPage },
    });
    return response.data;
};

export const createPost = async (payload: CreatePostPayload): Promise<PostResponse> => {
    const formData = new FormData();

    if (payload.content) formData.append("content", payload.content);
    if (payload.privacy) formData.append("privacy", payload.privacy);
    if (payload.files?.length) {
        payload.files.forEach((file) => formData.append("files[]", file));
    }

    const response = await api.post<PostResponse>(ENDPOINTS.POSTS, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

export const deletePost = async (
    id: number
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
        ENDPOINTS.POST_BY_ID(id)
    );
    return response.data;
};

// ============ Hashtag API ============

export const getHashtagPosts = async (
    hashtagName: string,
    page: number = 1,
    perPage: number = 10
): Promise<PostsResponse> => {
    const response = await api.get<PostsResponse>(ENDPOINTS.HASHTAG_POSTS(hashtagName), {
        params: { page, per_page: perPage },
    });
    return response.data;
};

export const searchHashtags = async (keyword: string) => {
    const response = await api.get(ENDPOINTS.SEARCH_HASHTAGS, {
        params: { q: keyword },
    });
    return response.data;
};

export const getTrendingHashtags = async () => {
    const response = await api.get(ENDPOINTS.TRENDING_HASHTAGS);
    return response.data;
};

// ============ Like API ============

export const toggleLike = async (postId: number): Promise<ToggleLikeResponse> => {
    const response = await api.post<ToggleLikeResponse>(ENDPOINTS.POST_LIKE(postId));
    return response.data;
};

// ============ Comment API ============

export const getComments = async (
    postId: number,
    page: number = 1,
    perPage: number = 10
): Promise<CommentsResponse> => {
    const response = await api.get<CommentsResponse>(ENDPOINTS.POST_COMMENTS(postId), {
        params: { page, per_page: perPage },
    });
    return response.data;
};

export const createComment = async (
    postId: number,
    content: string,
    parentId?: number
): Promise<{ success: boolean; data: Comment }> => {
    const response = await api.post<{ success: boolean; data: Comment }>(
        ENDPOINTS.POST_COMMENTS(postId),
        { content, ...(parentId ? { parent_id: parentId } : {}) }
    );
    return response.data;
};

export const toggleCommentLike = async (
    commentId: number
): Promise<{ success: boolean; data: { liked: boolean } }> => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data;
};

// ============ Share API ============

export const sharePost = async (
    postId: number
): Promise<{ success: boolean; data: unknown }> => {
    const response = await api.post<{ success: boolean; data: unknown }>(
        ENDPOINTS.POST_SHARE(postId)
    );
    return response.data;
};

export default {
    getMyPosts,
    getPosts,
    getPostById,
    getPostsByUser,
    getPostsByUserId,
    createPost,
    updatePost,
    deletePost,
    getHashtagPosts,
    searchHashtags,
    getTrendingHashtags,
    toggleLike,
    getComments,
    createComment,
    toggleCommentLike,
    sharePost,
};