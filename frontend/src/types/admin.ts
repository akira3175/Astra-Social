import { Pagination } from "./post";

export interface AdminUser {
    id: number;
    username: string;
    email: string;
    avatar_url: string | null;
    first_name: string | null;
    last_name: string | null;
    role: Role;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    last_login: string | null;
}

export interface AdminPost {
    id: number;
    content: string | null;
    privacy: 'PUBLIC' | 'FRIENDS' | 'ONLY_ME';
    likes_count: number;
    comments_count: number;
    created_at: string;
    deleted_at: string | null;
    user: AdminUser;
    report_count: number;
}

export interface AdminComment {
    id: number;
    content: string;
    post_id: number;
    parent_id: number | null;
    created_at: string;
    user: AdminUser;
    post_preview: string;
    post?: AdminPost | null;
}

export interface AdminReport {
    id: number;
    reporter: {
        id: number;
        username: string;
        avatar_url: string | null;
    };
    target_type: 'POST' | 'COMMENT' | 'USER';
    target_id: number;
    target_preview: string;
    target_author: {
        id: number;
        username: string;
        avatar_url: string | null;
    };
    reason: string;
    status: 'PENDING' | 'RESOLVED' | 'REJECTED';
    created_at: string;
    resolved_at: string | null;
}

export interface DashboardStats {
    users: UsersResponse;
    posts: PostsResponse;
    comments: CommentsResponse;
    reports: ReportsResponse;
}

export interface DailyActivity {
    day: string;
    posts: number;
    comments: number;
    reports: number;
}

export interface Permission {
    id: number;
    slug: string;
    description: string;
    group: string;
}

export interface Role {
    id?: number;
    name?: string;
    description?: string;
    is_default?: boolean;
    user_count?: number;
    permissions: Permission[];
    created_at?: string;
}

export interface RolesResponse {
    success: boolean;
    message: string | null;
    data: Role[];
}

export interface ReportsResponse {
    success: boolean;
    data: AdminReport[];
    pagination: Pagination;
}

export interface PermissionsResponse {
    success: boolean;
    data: Permission[];
}

export interface PaginatedAdminUsers {
    current_page: number;
    data: AdminUser[];
    first_page_url?: string;
    from?: number;
    last_page: number;
    last_page_url?: string;
    next_page_url?: string | null;
    path?: string;
    per_page: number;
    prev_page_url?: string | null;
    to?: number;
    total: number;
}

export interface UsersResponse {
    success: boolean;
    data: PaginatedAdminUsers;
    message: string | null;
}

export interface PaginatedAdminPosts {
    current_page: number;
    data: AdminPost[];
    first_page_url?: string;
    from?: number;
    last_page: number;
    last_page_url?: string;
    next_page_url?: string | null;
    path?: string;
    per_page: number;
    prev_page_url?: string | null;
    to?: number;
    total: number;
}

export interface PostsResponse {
    success: boolean;
    data: PaginatedAdminPosts;
    message: string | null;
}

export interface PaginatedAdminComments {
    current_page: number;
    data: AdminComment[];
    first_page_url?: string;
    from?: number;
    last_page: number;
    last_page_url?: string;
    next_page_url?: string | null;
    path?: string;
    per_page: number;
    prev_page_url?: string | null;
    to?: number;
    total: number;
}

export interface CommentsResponse {
    success: boolean;
    data: PaginatedAdminComments;
    message: string | null;
}