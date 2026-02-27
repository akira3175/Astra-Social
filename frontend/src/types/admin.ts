/**
 * Admin Types
 * Types for admin dashboard, post/comment management, and reports
 */

export interface AdminUser {
    id: number;
    username: string;
    email: string;
    avatar_url: string | null;
    first_name: string | null;
    last_name: string | null;
    role: string;
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
    user: {
        id: number;
        username: string;
        avatar_url: string | null;
        first_name: string | null;
        last_name: string | null;
    };
    report_count: number;
}

export interface AdminComment {
    id: number;
    content: string;
    post_id: number;
    parent_id: number | null;
    created_at: string;
    user: {
        id: number;
        username: string;
        avatar_url: string | null;
        first_name: string | null;
        last_name: string | null;
    };
    post_preview: string;
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
    target_author: string;
    reason: string;
    status: 'PENDING' | 'RESOLVED' | 'REJECTED';
    created_at: string;
    resolved_at: string | null;
}

export interface DashboardStats {
    total_users: number;
    total_posts: number;
    total_comments: number;
    pending_reports: number;
    user_growth: number;    // percentage
    post_growth: number;
    comment_growth: number;
    report_change: number;
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
    id: number;
    name: string;
    description: string;
    is_default: boolean;
    user_count: number;
    permissions: number[];   // permission IDs
    created_at: string;
}

export interface ReportsResponse{
    success: boolean,
    data: Report[],
    pagination: Pagination,
}

