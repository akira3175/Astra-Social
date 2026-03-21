import { api } from "../configs/api";
import type {
    AdminPost,
    AdminComment,
    AdminReport,
    AdminUser,
    DashboardStats,
    DailyActivity,
    Permission,
    Role,
    PostsResponse,
    CommentResponse,
    PermissionsResponse,
    ReportsResponse,
    RolesResponse,
    UsersResponse,
} from "../types/admin";

export const ENDPOINTS = {
    REPORTS : "/reports",
    COUNT_REPORTS_BY_DAYS: (days:number)=> `/count-reports-admin-days/${days}`,
    ROLES : "/roles",
    ROLES_BY_ID: (id:number)=>`/roles/${id}`,
    PERMISSIONS: '/permissions',
    USERS: '/users',
    USERS_U_ACTIVE: '/users/update-active',
    USERS_U_ROLE: '/users/update-role',
    POSTS: '/posts-admin',
    COUNT_POSTS_BY_DAYS: (days:number) => `/count-posts-admin-days/${days}`,
    POSTS_BY_ID: (id:number)=> `/posts/${id}`,
    POSTS_ADMIN_BY_ID: (id:number)=> `/posts-admin/${id}`,
    POST_RESTORE: (id:number)=> `/post-restore/${id}`,
    COMMENTS: '/comments',
    COUNT_COMMENTS_BY_DAYS: (days:number)=> `/count-comments-admin-days/${days}`,
    COMMENTS_BY_ID: (id:number)=>`/comments/${id}`,
};

// daashboard

export const getDashboardStats = async (): Promise<DashboardStats> => {
    let reports = await getReports(null,null, "ALL", 'PENDING', '');
    let users = await getUsers(1, '', '', '');
    let posts = await getPosts(1, '', '', '');
    let comments = await getComments(1, '', '');
    return {
        reports:reports,
        posts:posts,
        comments: comments,
        users: users,
    };
};

export const getDailyActivity = async (days:number): Promise<any> => {
    let postsCount = await api.get<any>(ENDPOINTS.COUNT_POSTS_BY_DAYS(days));
    let reportsCount = await api.get<any>(ENDPOINTS.COUNT_REPORTS_BY_DAYS(days));
    let commentsCount = await api.get<any>(ENDPOINTS.COUNT_COMMENTS_BY_DAYS(days));

    let posts=postsCount.data.data;
    let comments= commentsCount.data.data;
    let reports = reportsCount.data.data;

    let result ={};
    const addData = (type: string, arr: any[])=>{
        arr.forEach(item => {
            if(!result[item.date]){
                result[item.date]={
                    date: item.date,
                    posts:0,
                    comments:0,
                    reports:0,
                };
            }
            result[item.date][type]=item.total;
        });
    };
    addData('posts', posts);
    addData('comments', comments);
    addData('reports', reports);

    let dailyActivity = Object.values(result);
    return dailyActivity;
};

// post

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

export const deletePost = async (id: number): Promise<AdminPost> => {
    let response = await api.delete<PostsResponse>(ENDPOINTS.POSTS_ADMIN_BY_ID(id));
    return response.data;
};

export const restorePost = async (id: number): Promise<AdminPost> => {
    let response = await api.patch<PostsResponse>(ENDPOINTS.POST_RESTORE(id));
    return response.data;
};

// comment

export const getComments = async (
    page: number,
    type: string,
    search: string
    ): Promise<AdminComment[]> => {
    let response = await api.get<CommentResponse>(ENDPOINTS.COMMENTS, {
        params:{
            page:page,
            type:type,
            search: search
        }
    });
    return response.data;
};

export const deleteComment = async (id: number): Promise<AdminComment> => {
    let response = await api.delete<CommentResponse>(ENDPOINTS.COMMENTS_BY_ID(id));
    return response.data;
};

// report

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

export const handleStatus = async (id: number, status: string, userId: number): Promise<AdminReport> => {
    const response = await api.patch<ReportsResponse>(ENDPOINTS.REPORTS,null,{
        params:{
            id:id,
            status:status,
            user_id: userId | null
        }
    });
    return response.data;
};

// User 

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

// role

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

export const updateRole = async (id: number, data: { description?: string; permissions?: number[] }): Promise<Role> => {
    const roleEdited: Role = {
        id: id,
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
    handleStatus,
    restorePost,
    changeUserRole,
    getDashboardStats,
    getDailyActivity,
    getUsers,
    getPosts,
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
}