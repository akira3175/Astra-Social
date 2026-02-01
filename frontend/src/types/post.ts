/**
 * Post Types
 * Types related to posts and media attachments
 */

/**
 * Media Attachment from API
 */
export interface MediaAttachment {
    id: number;
    url: string;
    file_type: 'IMAGE' | 'VIDEO' | 'FILE';
    entity_type: string;
    entity_id: number;
    created_at: string;
}

/**
 * Post Author info (subset of user)
 */
export interface PostAuthor {
    id: number;
    username: string;
    profile: {
        first_name: string | null;
        last_name: string | null;
        avatar_url: string | null;
    } | null;
}

/**
 * Post from API response
 */
export interface Post {
    id: number;
    user_id: number;
    parent_id: number | null;
    content: string | null;
    privacy: 'PUBLIC' | 'FRIENDS' | 'ONLY_ME';
    likes_count: number;
    comments_count: number;
    created_at: string;
    deleted_at: string | null;
    user: PostAuthor;
    attachments: MediaAttachment[];
}

/**
 * Pagination info from API
 */
export interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_more: boolean;
}

/**
 * API Response for posts list
 */
export interface PostsResponse {
    success: boolean;
    data: Post[];
    pagination: Pagination;
}

/**
 * API Response for single post
 */
export interface PostResponse {
    success: boolean;
    data: Post;
}

/**
 * Create post request payload
 */
export interface CreatePostPayload {
    content?: string;
    privacy?: 'PUBLIC' | 'FRIENDS' | 'ONLY_ME';
    files?: File[];
}

/**
 * Update post request payload
 */
export interface UpdatePostPayload {
    content?: string;
    privacy?: 'PUBLIC' | 'FRIENDS' | 'ONLY_ME';
}
