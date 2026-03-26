import { api } from "../configs/api";
import type {
    AdminPost,
    AdminReport,
    AdminUser,
    DashboardStats,
    DailyActivity,
    Permission,
    Role,
    PostsResponse,
    CommentsResponse,
    PermissionsResponse,
    ReportsResponse,
    RolesResponse,
    UsersResponse,
} from "../types/admin";

export const ENDPOINTS = {
    REPORTS: "/reports",
    COUNT_REPORTS_BY_DAYS: (days: number) => `/count-reports-admin-days/${days}`,
    ROLES: "/roles",
    ROLES_BY_ID: (id: number) => `/roles/${id}`,
    PERMISSIONS: "/permissions",
    USERS: "/users",
    USERS_U_ACTIVE: "/users/update-active",
    USERS_U_ROLE: "/users/update-role",
    POSTS: "/posts-admin",
    COUNT_POSTS_BY_DAYS: (days: number) => `/count-posts-admin-days/${days}`,
    POSTS_BY_ID: (id: number) => `/posts/${id}`,
    POSTS_ADMIN_BY_ID: (id: number) => `/posts-admin/${id}`,
    POST_RESTORE: (id: number) => `/post-restore/${id}`,
    COMMENTS: "/comments",
    COUNT_COMMENTS_BY_DAYS: (days: number) => `/count-comments-admin-days/${days}`,
    COMMENTS_BY_ID: (id: number) => `/comments/${id}`,
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const [reportsRes, usersRes, postsRes, commentsRes] = await Promise.all([
        getReports(1, null, "ALL", "PENDING", ""),
        getUsers(1, "", "", ""),
        getPosts(1, "", "", ""),
        getComments(1, "", ""),
    ]);

    return {
        users: usersRes,
        posts: postsRes,
        comments: commentsRes,
        reports: reportsRes,
    } as unknown as DashboardStats;
};


export const getDailyActivity = async (days: number): Promise<any[]> => {
    const [postsCount, reportsCount, commentsCount] = await Promise.all([
        api.get<any>(ENDPOINTS.COUNT_POSTS_BY_DAYS(days)),
        api.get<any>(ENDPOINTS.COUNT_REPORTS_BY_DAYS(days)),
        api.get<any>(ENDPOINTS.COUNT_COMMENTS_BY_DAYS(days)),
    ]);

    const result: Record<string, { date: string; posts: number; comments: number; reports: number }> = {};

    const addData = (type: "posts" | "comments" | "reports", arr: any[]) => {
        arr.forEach((item) => {
            if (!result[item.date]) {
                result[item.date] = { date: item.date, posts: 0, comments: 0, reports: 0 };
            }
            result[item.date][type] = item.total;
        });
    };

    addData("posts",    postsCount.data.data);
    addData("comments", commentsCount.data.data);
    addData("reports",  reportsCount.data.data);

    return Object.values(result);
};

// ─── Posts ────────────────────────────────────────────────────────────────────

export const getPosts = async (
    page: number,
    privacy: string,
    status: string,
    search: string,
): Promise<PostsResponse> => {
    const response = await api.get<PostsResponse>(ENDPOINTS.POSTS, {
        params: { page, privacy, status, search },
    });
    return response.data;
};

export const getAdminPostById = async (id: number): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>(ENDPOINTS.POSTS_ADMIN_BY_ID(id));
    return response.data;
};

export const deletePost = async (id: number): Promise<{ success: boolean; message?: string }> => {
    const response = await api.delete<{ success: boolean; message?: string }>(ENDPOINTS.POSTS_ADMIN_BY_ID(id));
    return response.data;
};

export const restorePost = async (id: number): Promise<{ success: boolean; data?: AdminPost; message?: string }> => {
    const response = await api.patch<{ success: boolean; data?: AdminPost; message?: string }>(ENDPOINTS.POST_RESTORE(id));
    return response.data;
};

// ─── Comments ─────────────────────────────────────────────────────────────────

export const getComments = async (
    page: number,
    type: string,
    search: string,
): Promise<CommentsResponse> => {
    const response = await api.get<CommentsResponse>(ENDPOINTS.COMMENTS, {
        params: { page, type, search },
    });
    return response.data;
};

export const deleteComment = async (id: number): Promise<{ success: boolean; message: string; }> => {
    const response = await api.delete<{ success: boolean; message: string; }>(ENDPOINTS.COMMENTS_BY_ID(id));
    return response.data;
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const getReports = async (
    page: number,
    perPage: number | null,
    targetType: string,
    status: string,
    searchQuery: string,
): Promise<ReportsResponse> => {
    const response = await api.get<ReportsResponse>(ENDPOINTS.REPORTS, {
        params: {
            page,
            per_page:    perPage,
            target_type: targetType,
            status,
            search:      searchQuery,
        },
    });
    return response.data;
};

export const handleStatus = async (
    id: number,
    status: string,
    userId?: number,
): Promise<ReportsResponse> => {
    const response = await api.patch<ReportsResponse>(ENDPOINTS.REPORTS, null, {
        params: {
            id,
            status,
            user_id: userId ?? null,
        },
    });
    return response.data;
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const getUsers = async (
    page: number,
    roleFilter: string,
    statusFilter: string,
    searchQuery: string,
): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>(ENDPOINTS.USERS, {
        params: { page, role: roleFilter, status: statusFilter, search: searchQuery },
    });
    return response.data;
};

// Gửi body (không phải params) vì là mutation
export const updateIsActiveUser = async (
    id: number,
    isActive: boolean,
): Promise<{ success: boolean; message?: string }> => {
    const response = await api.patch<{ success: boolean; message?: string }>(ENDPOINTS.USERS_U_ACTIVE, {
        id,
        is_active: isActive,
    });
    return response.data;
};

export const changeUserRole = async (
    id: number, 
    roleId: number
): Promise<{ success: boolean; message?: string }> => {
    const response = await api.patch<{ success: boolean; message?: string }>(ENDPOINTS.USERS_U_ROLE, {
        id,
        role_id: roleId,
    });
    return response.data;
};

// ─── Roles & Permissions ──────────────────────────────────────────────────────

export const getPermissions = async (): Promise<PermissionsResponse> => {
    const response = await api.get<PermissionsResponse>(ENDPOINTS.PERMISSIONS);
    return response.data;
};

export const getRoles = async (): Promise<RolesResponse> => {
    const response = await api.get<RolesResponse>(ENDPOINTS.ROLES);
    return response.data;
};

// API nhận permission ids (number[]), không phải Permission objects
export const createRole = async (data: {
    name: string;
    description: string;
    permissions: number[];
}): Promise<Role> => {
    const response = await api.post<RolesResponse>(ENDPOINTS.ROLES, data);
    return response.data.data[0];
};

export const updateRole = async (
    id: number,
    data: { description?: string; permissions?: number[] },
): Promise<Role> => {
    const response = await api.patch<RolesResponse>(ENDPOINTS.ROLES_BY_ID(id), {
        id,
        ...data,
    });
    return response.data.data[0];
};

export const deleteRole = async (id: number): Promise<Role> => {
    const response = await api.delete<RolesResponse>(ENDPOINTS.ROLES_BY_ID(id));
    return response.data.data[0];
};

export default {
    handleStatus,
    restorePost,
    changeUserRole,
    getDashboardStats,
    getDailyActivity,
    getUsers,
    getPosts,
    getAdminPostById,
    getComments,
    getReports,
    getPermissions,
    getRoles,
    createRole,
    updateIsActiveUser,
    updateRole,
    deleteRole,
    deletePost,
    ENDPOINTS,
};