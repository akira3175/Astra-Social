import { api } from "../configs/api";
import type {
    ReportsResponse,
    AdminPost,
    PostsResponse,
    AdminComment,
    AdminReport,
    AdminUser,
    DashboardStats,
    DailyActivity,
    Permission,
    PermissionsResponse,
    Role,
    RolesResponse,
    UsersResponse,
} from "../types/admin";

export const ENDPOINTS = {
    REPORTS : "/reports",
    ROLES : "/roles",
    ROLES_BY_ID: (id:number)=>`/roles/${id}`,
    PERMISSIONS: '/permissions',
    USERS: '/users',
    USERS_U_ACTIVE: '/users/update-active',
    USERS_U_ROLE: '/users/update-role',
    POSTS: '/posts-admin',
    POST_BY_ID: (id:number)=> `/posts/${id}`,
    POST_RESTORE: (id:number)=> `/post-restore/${id}`,
};

// ============ Mock Data ============

const mockUsers = [
    { id: 1, username: "nguyenvana", avatar_url: null, first_name: "Nguyễn Văn", last_name: "A" },
    { id: 2, username: "tranthib", avatar_url: null, first_name: "Trần Thị", last_name: "B" },
    { id: 3, username: "lequangc", avatar_url: null, first_name: "Lê Quang", last_name: "C" },
    { id: 4, username: "phamminhduc", avatar_url: null, first_name: "Phạm Minh", last_name: "Đức" },
    { id: 5, username: "hoangthilan", avatar_url: null, first_name: "Hoàng Thị", last_name: "Lan" },
    { id: 6, username: "vothanhson", avatar_url: null, first_name: "Võ Thanh", last_name: "Sơn" },
    { id: 7, username: "dangthimai", avatar_url: null, first_name: "Đặng Thị", last_name: "Mai" },
    { id: 8, username: "buivannam", avatar_url: null, first_name: "Bùi Văn", last_name: "Nam" },
];

const mockPosts: AdminPost[] = [
    {
        id: 1, content: "Hôm nay trời đẹp quá! Ai muốn đi cafe không? ☕", privacy: "PUBLIC",
        likes_count: 45, comments_count: 12, created_at: "2026-02-23T10:30:00Z", deleted_at: null,
        user: mockUsers[0], report_count: 0,
    },
    {
        id: 2, content: "Chia sẻ kinh nghiệm học React cho người mới bắt đầu. Thread dài nha mọi người 🧵", privacy: "PUBLIC",
        likes_count: 128, comments_count: 34, created_at: "2026-02-23T09:15:00Z", deleted_at: null,
        user: mockUsers[1], report_count: 0,
    },
    {
        id: 3, content: "Nội dung spam quảng cáo bán hàng online giá rẻ...", privacy: "PUBLIC",
        likes_count: 2, comments_count: 0, created_at: "2026-02-22T14:00:00Z", deleted_at: null,
        user: mockUsers[2], report_count: 5,
    },
    {
        id: 4, content: "Đã bị xóa do vi phạm quy tắc cộng đồng", privacy: "PUBLIC",
        likes_count: 0, comments_count: 0, created_at: "2026-02-21T08:00:00Z", deleted_at: "2026-02-22T10:00:00Z",
        user: mockUsers[3], report_count: 8,
    },
    {
        id: 5, content: "Cuối tuần này ai rảnh đi leo núi không? 🏔️ Mình đang plan trip Tà Năng", privacy: "FRIENDS",
        likes_count: 23, comments_count: 7, created_at: "2026-02-22T18:30:00Z", deleted_at: null,
        user: mockUsers[4], report_count: 0,
    },
    {
        id: 6, content: "Review phim mới ra rạp tuần này 🎬 Hay lắm mọi người ơi!", privacy: "PUBLIC",
        likes_count: 67, comments_count: 15, created_at: "2026-02-22T12:00:00Z", deleted_at: null,
        user: mockUsers[5], report_count: 0,
    },
    {
        id: 7, content: "Bài viết chứa nội dung không phù hợp, ngôn từ thô tục...", privacy: "PUBLIC",
        likes_count: 1, comments_count: 3, created_at: "2026-02-21T20:15:00Z", deleted_at: null,
        user: mockUsers[6], report_count: 3,
    },
    {
        id: 8, content: "Mới adopt được em mèo này 🐱 Cute quá trời!", privacy: "PUBLIC",
        likes_count: 234, comments_count: 56, created_at: "2026-02-21T16:45:00Z", deleted_at: null,
        user: mockUsers[7], report_count: 0,
    },
    {
        id: 9, content: "Tips tiết kiệm tiền cho sinh viên 💰", privacy: "PUBLIC",
        likes_count: 89, comments_count: 21, created_at: "2026-02-21T11:30:00Z", deleted_at: null,
        user: mockUsers[0], report_count: 0,
    },
    {
        id: 10, content: "Đây là bài viết riêng tư của tôi", privacy: "ONLY_ME",
        likes_count: 0, comments_count: 0, created_at: "2026-02-20T09:00:00Z", deleted_at: null,
        user: mockUsers[1], report_count: 0,
    },
    {
        id: 11, content: "Quảng cáo MLM, kiếm tiền online nhanh chóng...", privacy: "PUBLIC",
        likes_count: 0, comments_count: 1, created_at: "2026-02-20T07:30:00Z", deleted_at: "2026-02-20T12:00:00Z",
        user: mockUsers[2], report_count: 6,
    },
    {
        id: 12, content: "Chia sẻ công thức nấu phở bò chuẩn Hà Nội 🍜", privacy: "PUBLIC",
        likes_count: 156, comments_count: 42, created_at: "2026-02-19T15:00:00Z", deleted_at: null,
        user: mockUsers[3], report_count: 0,
    },
];

const mockComments: AdminComment[] = [
    { id: 1, content: "Bài viết hay quá! Cảm ơn bạn chia sẻ 👍", post_id: 2, parent_id: null, created_at: "2026-02-23T09:30:00Z", user: mockUsers[0], post_preview: "Chia sẻ kinh nghiệm học React..." },
    { id: 2, content: "Mình cũng đang học React, follow để đọc thêm", post_id: 2, parent_id: null, created_at: "2026-02-23T09:45:00Z", user: mockUsers[4], post_preview: "Chia sẻ kinh nghiệm học React..." },
    { id: 3, content: "Đúng rồi bạn, mình cũng thấy vậy!", post_id: 2, parent_id: 1, created_at: "2026-02-23T10:00:00Z", user: mockUsers[1], post_preview: "Chia sẻ kinh nghiệm học React..." },
    { id: 4, content: "Spam comment - mua hàng giá rẻ tại đây", post_id: 1, parent_id: null, created_at: "2026-02-23T10:35:00Z", user: mockUsers[2], post_preview: "Hôm nay trời đẹp quá!" },
    { id: 5, content: "Comment chứa ngôn từ xúc phạm...", post_id: 6, parent_id: null, created_at: "2026-02-22T12:30:00Z", user: mockUsers[6], post_preview: "Review phim mới ra rạp..." },
    { id: 6, content: "Quá cute luôn! Giống mèo nhà mình 😍", post_id: 8, parent_id: null, created_at: "2026-02-21T17:00:00Z", user: mockUsers[0], post_preview: "Mới adopt được em mèo này..." },
    { id: 7, content: "Cho mình xin công thức với ạ!", post_id: 12, parent_id: null, created_at: "2026-02-19T15:30:00Z", user: mockUsers[5], post_preview: "Chia sẻ công thức nấu phở bò..." },
    { id: 8, content: "Mình làm theo ngon lắm, cảm ơn!", post_id: 12, parent_id: 7, created_at: "2026-02-19T18:00:00Z", user: mockUsers[7], post_preview: "Chia sẻ công thức nấu phở bò..." },
    { id: 9, content: "Tà Năng đi mùa này đẹp lắm nha", post_id: 5, parent_id: null, created_at: "2026-02-22T19:00:00Z", user: mockUsers[3], post_preview: "Cuối tuần này ai rảnh đi leo núi..." },
    { id: 10, content: "Quảng cáo trong comment, link spam...", post_id: 9, parent_id: null, created_at: "2026-02-21T12:00:00Z", user: mockUsers[2], post_preview: "Tips tiết kiệm tiền cho sinh viên" },
    { id: 11, content: "Bạn ơi cho mình hỏi phần useState thêm được không?", post_id: 2, parent_id: null, created_at: "2026-02-23T11:00:00Z", user: mockUsers[7], post_preview: "Chia sẻ kinh nghiệm học React..." },
    { id: 12, content: "Cafe ở đâu vậy bạn? Mình muốn join!", post_id: 1, parent_id: null, created_at: "2026-02-23T11:15:00Z", user: mockUsers[5], post_preview: "Hôm nay trời đẹp quá!" },
    { id: 13, content: "Mình thích quán ở Thảo Điền, view sông đẹp lắm", post_id: 1, parent_id: 12, created_at: "2026-02-23T11:30:00Z", user: mockUsers[0], post_preview: "Hôm nay trời đẹp quá!" },
    { id: 14, content: "Phim đó mình xem rồi, ending bất ngờ ghê!", post_id: 6, parent_id: null, created_at: "2026-02-22T13:00:00Z", user: mockUsers[4], post_preview: "Review phim mới ra rạp..." },
    { id: 15, content: "Em mèo tam thể xinh quá!", post_id: 8, parent_id: null, created_at: "2026-02-21T17:30:00Z", user: mockUsers[1], post_preview: "Mới adopt được em mèo này..." },
];

const mockReports: AdminReport[] = [
    {
        id: 1, reporter: { id: 1, username: "nguyenvana", avatar_url: null },
        target_type: "POST", target_id: 3, target_preview: "Nội dung spam quảng cáo bán hàng online giá rẻ...",
        target_author: "lequangc", reason: "Spam/Quảng cáo", status: "PENDING",
        created_at: "2026-02-22T15:00:00Z", resolved_at: null,
    },
    {
        id: 2, reporter: { id: 5, username: "hoangthilan", avatar_url: null },
        target_type: "POST", target_id: 3, target_preview: "Nội dung spam quảng cáo bán hàng online giá rẻ...",
        target_author: "lequangc", reason: "Spam/Quảng cáo", status: "PENDING",
        created_at: "2026-02-22T16:00:00Z", resolved_at: null,
    },
    {
        id: 3, reporter: { id: 4, username: "phamminhduc", avatar_url: null },
        target_type: "POST", target_id: 7, target_preview: "Bài viết chứa nội dung không phù hợp, ngôn từ thô tục...",
        target_author: "dangthimai", reason: "Ngôn từ thô tục/Xúc phạm", status: "PENDING",
        created_at: "2026-02-22T08:00:00Z", resolved_at: null,
    },
    {
        id: 4, reporter: { id: 1, username: "nguyenvana", avatar_url: null },
        target_type: "COMMENT", target_id: 4, target_preview: "Spam comment - mua hàng giá rẻ tại đây",
        target_author: "lequangc", reason: "Spam trong bình luận", status: "PENDING",
        created_at: "2026-02-23T11:00:00Z", resolved_at: null,
    },
    {
        id: 5, reporter: { id: 7, username: "dangthimai", avatar_url: null },
        target_type: "COMMENT", target_id: 5, target_preview: "Comment chứa ngôn từ xúc phạm...",
        target_author: "dangthimai", reason: "Ngôn từ xúc phạm", status: "PENDING",
        created_at: "2026-02-22T13:00:00Z", resolved_at: null,
    },
    {
        id: 6, reporter: { id: 8, username: "buivannam", avatar_url: null },
        target_type: "POST", target_id: 4, target_preview: "Đã bị xóa do vi phạm quy tắc cộng đồng",
        target_author: "phamminhduc", reason: "Vi phạm quy tắc cộng đồng", status: "RESOLVED",
        created_at: "2026-02-21T09:00:00Z", resolved_at: "2026-02-22T10:00:00Z",
    },
    {
        id: 7, reporter: { id: 5, username: "hoangthilan", avatar_url: null },
        target_type: "POST", target_id: 11, target_preview: "Quảng cáo MLM, kiếm tiền online nhanh chóng...",
        target_author: "lequangc", reason: "Lừa đảo/MLM", status: "RESOLVED",
        created_at: "2026-02-20T08:00:00Z", resolved_at: "2026-02-20T12:00:00Z",
    },
    {
        id: 8, reporter: { id: 3, username: "lequangc", avatar_url: null },
        target_type: "COMMENT", target_id: 10, target_preview: "Quảng cáo trong comment, link spam...",
        target_author: "lequangc", reason: "Link spam", status: "REJECTED",
        created_at: "2026-02-21T13:00:00Z", resolved_at: "2026-02-21T15:00:00Z",
    },
    {
        id: 9, reporter: { id: 6, username: "vothanhson", avatar_url: null },
        target_type: "POST", target_id: 7, target_preview: "Bài viết chứa nội dung không phù hợp, ngôn từ thô tục...",
        target_author: "dangthimai", reason: "Nội dung không phù hợp", status: "PENDING",
        created_at: "2026-02-22T09:30:00Z", resolved_at: null,
    },
    {
        id: 10, reporter: { id: 2, username: "tranthib", avatar_url: null },
        target_type: "POST", target_id: 3, target_preview: "Nội dung spam quảng cáo bán hàng online giá rẻ...",
        target_author: "lequangc", reason: "Spam", status: "PENDING",
        created_at: "2026-02-22T17:00:00Z", resolved_at: null,
    },
];

// ============ Admin Users Mock Data ============

const mockAdminUsers: AdminUser[] = [
    {
        id: 1, username: "devmaster", email: "dev@astrasocial.com", avatar_url: null,
        first_name: "System", last_name: "Developer", role: "Dev",
        is_active: true, is_verified: true,
        created_at: "2026-01-01T00:00:00Z", last_login: "2026-02-24T01:30:00Z",
    },
    {
        id: 2, username: "admin01", email: "admin@astrasocial.com", avatar_url: null,
        first_name: "Admin", last_name: "User", role: "Admin",
        is_active: true, is_verified: true,
        created_at: "2026-01-02T08:00:00Z", last_login: "2026-02-24T00:45:00Z",
    },
    {
        id: 3, username: "nguyenvana", email: "nguyenvana@gmail.com", avatar_url: null,
        first_name: "Nguyễn Văn", last_name: "A", role: "User",
        is_active: true, is_verified: true,
        created_at: "2026-01-10T09:15:00Z", last_login: "2026-02-23T18:00:00Z",
    },
    {
        id: 4, username: "tranthib", email: "tranthib@gmail.com", avatar_url: null,
        first_name: "Trần Thị", last_name: "B", role: "Mod",
        is_active: true, is_verified: true,
        created_at: "2026-01-12T14:30:00Z", last_login: "2026-02-23T22:10:00Z",
    },
    {
        id: 5, username: "lequangc", email: "lequangc@yahoo.com", avatar_url: null,
        first_name: "Lê Quang", last_name: "C", role: "User",
        is_active: false, is_verified: true,
        created_at: "2026-01-15T11:00:00Z", last_login: "2026-02-20T07:00:00Z",
    },
    {
        id: 6, username: "phamminhduc", email: "phamminhduc@outlook.com", avatar_url: null,
        first_name: "Phạm Minh", last_name: "Đức", role: "User",
        is_active: true, is_verified: true,
        created_at: "2026-01-18T16:45:00Z", last_login: "2026-02-22T20:30:00Z",
    },
    {
        id: 7, username: "hoangthilan", email: "hoangthilan@gmail.com", avatar_url: null,
        first_name: "Hoàng Thị", last_name: "Lan", role: "User",
        is_active: true, is_verified: false,
        created_at: "2026-01-20T10:00:00Z", last_login: "2026-02-23T15:20:00Z",
    },
    {
        id: 8, username: "vothanhson", email: "vothanhson@gmail.com", avatar_url: null,
        first_name: "Võ Thanh", last_name: "Sơn", role: "Content Writer",
        is_active: true, is_verified: true,
        created_at: "2026-01-22T13:00:00Z", last_login: "2026-02-23T19:45:00Z",
    },
    {
        id: 9, username: "dangthimai", email: "dangthimai@hotmail.com", avatar_url: null,
        first_name: "Đặng Thị", last_name: "Mai", role: "User",
        is_active: true, is_verified: true,
        created_at: "2026-01-25T08:30:00Z", last_login: "2026-02-21T10:00:00Z",
    },
    {
        id: 10, username: "buivannam", email: "buivannam@gmail.com", avatar_url: null,
        first_name: "Bùi Văn", last_name: "Nam", role: "User",
        is_active: true, is_verified: true,
        created_at: "2026-01-28T17:20:00Z", last_login: "2026-02-22T14:00:00Z",
    },
    {
        id: 11, username: "truonganh", email: "truonganh@gmail.com", avatar_url: null,
        first_name: "Trương", last_name: "Anh", role: "Mod",
        is_active: true, is_verified: true,
        created_at: "2026-02-01T09:00:00Z", last_login: "2026-02-23T21:00:00Z",
    },
    {
        id: 12, username: "spammer99", email: "spammer99@tempmail.com", avatar_url: null,
        first_name: null, last_name: null, role: "User",
        is_active: false, is_verified: false,
        created_at: "2026-02-10T06:00:00Z", last_login: null,
    },
];

const mockDailyActivity: DailyActivity[] = [
    { day: "T2", posts: 45, comments: 120, reports: 3 },
    { day: "T3", posts: 52, comments: 98, reports: 5 },
    { day: "T4", posts: 38, comments: 145, reports: 2 },
    { day: "T5", posts: 65, comments: 167, reports: 7 },
    { day: "T6", posts: 72, comments: 189, reports: 4 },
    { day: "T7", posts: 89, comments: 234, reports: 8 },
    { day: "CN", posts: 78, comments: 201, reports: 6 },
];

// ============ Permissions & Roles Mock Data ============

const mockPermissions: Permission[] = [
    // Người dùng
    { id: 1, slug: "user.view", description: "Xem danh sách người dùng", group: "Người dùng" },
    { id: 2, slug: "user.ban", description: "Khóa/Mở khóa tài khoản", group: "Người dùng" },
    { id: 3, slug: "user.assign_role", description: "Gán vai trò cho người dùng", group: "Người dùng" },
    // Bài viết
    { id: 4, slug: "post.view", description: "Xem tất cả bài viết", group: "Bài viết" },
    { id: 5, slug: "post.delete", description: "Xóa bài viết", group: "Bài viết" },
    { id: 6, slug: "post.restore", description: "Khôi phục bài viết đã xóa", group: "Bài viết" },
    // Bình luận
    { id: 7, slug: "comment.view", description: "Xem tất cả bình luận", group: "Bình luận" },
    { id: 8, slug: "comment.delete", description: "Xóa bình luận", group: "Bình luận" },
    // Báo cáo
    { id: 9, slug: "report.view", description: "Xem danh sách báo cáo", group: "Báo cáo" },
    { id: 10, slug: "report.resolve", description: "Xử lý báo cáo (xóa nội dung)", group: "Báo cáo" },
    { id: 11, slug: "report.reject", description: "Từ chối báo cáo", group: "Báo cáo" },
    // Vai trò & Quyền
    { id: 12, slug: "role.view", description: "Xem danh sách vai trò", group: "Vai trò" },
    { id: 13, slug: "role.create", description: "Tạo vai trò mới", group: "Vai trò" },
    { id: 14, slug: "role.edit", description: "Chỉnh sửa vai trò", group: "Vai trò" },
    { id: 15, slug: "role.delete", description: "Xóa vai trò", group: "Vai trò" },
    // Dashboard
    { id: 16, slug: "dashboard.view", description: "Xem trang tổng quan", group: "Dashboard" },
];

let mockRoles: Role[] = [
    {
        id: 1, name: "Dev", description: "Nhà phát triển hệ thống — có toàn quyền (Super Admin)",
        is_default: true, user_count: 2,
        permissions: mockPermissions.map(p => p.id),   // all permissions
        created_at: "2026-01-01T00:00:00Z",
    },
    {
        id: 2, name: "Admin", description: "Quản trị viên hệ thống, có toàn quyền trừ Dev",
        is_default: true, user_count: 3,
        permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16],
        created_at: "2026-01-01T00:00:00Z",
    },
    {
        id: 3, name: "Mod", description: "Người kiểm duyệt nội dung",
        is_default: true, user_count: 5,
        permissions: [4, 5, 7, 8, 9, 10, 11, 16],
        created_at: "2026-01-01T00:00:00Z",
    },
    {
        id: 4, name: "User", description: "Người dùng thông thường, không có quyền quản trị",
        is_default: true, user_count: 1237,
        permissions: [],
        created_at: "2026-01-01T00:00:00Z",
    },
    {
        id: 5, name: "Content Writer", description: "Biên tập viên nội dung — xem và quản lý bài viết, bình luận",
        is_default: false, user_count: 4,
        permissions: [4, 5, 6, 7, 8, 16],
        created_at: "2026-02-10T08:00:00Z",
    },
];

let nextRoleId = 6;

// ============ Service Functions ============

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDashboardStats = async (): Promise<DashboardStats> => {
    await delay(300);
    let reports = await getReports(null,null, "ALL", 'PENDING', '');
    let users = await getUsers(1, '', '', '');
    return {
        total_users: users.data.total,
        total_posts: 8_563,
        total_comments: 24_891,
        pending_reports: reports.pagination.total,
    };
};

export const getDailyActivity = async (): Promise<DailyActivity[]> => {
    await delay(200);
    return mockDailyActivity;
};

export const getAdminPosts = async (): Promise<AdminPost[]> => {
    await delay(300);
    return [...mockPosts];
};

export const getPosts = async(
    page:number,
    privacy: string,
    status: string,
    search: string
    ): Promise<AdminPost[]>=>{
    let response = await api.get<PostsResponse>(ENDPOINTS.POSTS, {
        params:{
            page:page,
            privacy: privacy,
            status: status,
            search: search
        }
    });
    return response.data;
};

export const getAdminComments = async (): Promise<AdminComment[]> => {
    await delay(300);
    return [...mockComments];
};

export const getReports = async (
    page: number,
    perPage: number,
    targetType: string,
    status: string,
    searchQuery: string
    ): Promise<ReportsResponse> => {
    const response = await api.get<ReportsResponse>(ENDPOINTS.REPORTS,{
        params:{
            page:page,
            per_page: perPage,
            target_type: targetType,
            status: status,
            search: searchQuery
        }
    });
    return response.data;
};

export const getRecentReports = async (limit: number = 5): Promise<AdminReport[]> => {
    await delay(200);
    return mockReports
        .filter((r) => r.status === "PENDING")
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
};

export const getRecentPosts = async (limit: number = 5): Promise<AdminPost[]> => {
    await delay(200);
    return mockPosts
        .filter((p) => !p.deleted_at)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
};

export const handleStatus = async (id: number, status: string, userId: number): Promise<AdminReport> => {
    await delay(300);
    const response = await api.patch<ReportsResponse>(ENDPOINTS.REPORTS,null,{
        params:{
            id:id,
            status:status,
            user_id: userId | null
        }
    });
    return response.data;
};

export const restorePost = async (id: number): Promise<AdminPost> => {
    let response = await api.patch<PostsResponse>(ENDPOINTS.POST_RESTORE(id));
    return response.data;
};

export const deleteAdminComment = async (id: number): Promise<{ success: boolean }> => {
    await delay(300);
    const index = mockComments.findIndex((c) => c.id === id);
    if (index !== -1) {
        mockComments.splice(index, 1);
    }
    return { success: true };
};

// Users CRUD 

export const getUsers = async (
    page:number,
    roleFilter: string,
    statusFilter: string,
    searchQuery: string,
    ): Promise<AdminUser[]> => {
    let response = await api.get<UsersResponse>(ENDPOINTS.USERS,{
        params:{
            page: page,
            role: roleFilter,
            status: statusFilter,
            search: searchQuery,
        }
    });
    return response.data;
};

export const updateIsActiveUser = async(
    id: number,
    isActive: boolean
    ): Promise<AdminUser[]>=>{
    let response = await api.patch<UsersResponse>(ENDPOINTS.USERS_U_ACTIVE,{
        params:{
            id: id,
            is_active: isActive,
        }
    });
    return response.data;
};

export const changeUserRole = async (id: number, roleId: number): Promise<AdminUser> => {
    const response = await api.patch<UsersResponse>(ENDPOINTS.USERS_U_ROLE,{
        params:{
            id: id,
            role_id: roleId,
        }
    });
    return response.data;
};

// ============ Roles & Permissions CRUD ============

export const getPermissions = async (): Promise<Permission[]> => {
    const response = await api.get<PermissionsResponse>(ENDPOINTS.PERMISSIONS);
    return response.data;
};

export const getRoles = async (): Promise<Role[]> => {
    const response = await api.get<RolesResponse>(ENDPOINTS.ROLES);  
    return response.data;
};

export const createRole = async (data: { name: string; description: string; permissions: number[] }): Promise<Role> => {
    const newRole: Role = {
        name: data.name,
        description: data.description,
        permissions: [...data.permissions],
    };
    const response = await api.post<RolesResponse>(ENDPOINTS.ROLES, newRole);
    return response.data;
};

export const updateRole = async (id: number, data: { name?: string; description?: string; permissions?: number[] }): Promise<Role> => {
    const roleEdited: Role = {
        id: id,
        name: data.name,
        description: data.description,
        permissions: [...data.permissions],
    };
    const response = await api.patch<RolesResponse>(ENDPOINTS.ROLES_BY_ID(id), roleEdited);
    return response.data;
};

export const deleteRole = async (id: number): Promise<Role> => {
    const response = await api.delete<RolesResponse>(ENDPOINTS.ROLES_BY_ID(id));
    return response.data;
};

export default {
    getDashboardStats,
    getDailyActivity,
    getPosts,
    getAdminComments,
    getReports,
    getRecentReports,
    getRecentPosts,
    handleStatus,
    restorePost,
    deleteAdminComment,
    updateIsActiveUser,
    getUsers,
    changeUserRole,
    getPermissions,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    ENDPOINTS,
};
