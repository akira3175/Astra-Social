import { api } from "../configs/api";
import type {
    Notification,
    NotificationsResponse,
    UnreadCountResponse,
    NotificationType,
    EntityType,
} from "../types/notification";

const ENDPOINTS = {
    NOTI : "/noti",
};

// Flag để sử dụng mock data
const USE_MOCK = true;

export const getNotifications = async (
    user_id: number,
    limit: number = 10
): Promise<Notification> => {
    const response = await api.get<NotificationsResponse>(ENDPOINTS.NOTI,{
        params:{
            user_id: user_id,
            limit: limit,
        }
    });
    console.log(response.data);
    return response.data;
};

export const getUnreadCount = async (
    user_id: number, 
    is_read: boolean = false
): Promise<UnreadCountResponse> => {
    const response = await api.get<UnreadCountResponse>(`${ENDPOINTS.NOTI}/by-isread`, {
        params: {
            user_id: user_id,
            is_read: is_read,
        }
    });
    return response.data;
};

export const markAsRead = async (
    notificationId: number | string
): Promise<{ success: boolean; message: string }> => {
    // Controller dùng Route PATCH hoặc PUT tùy bạn cấu hình, ở đây dùng PUT theo mẫu của bạn
    const response = await api.put(`${ENDPOINTS.NOTI}/${notificationId}/read`);
    return response.data;
};

export const markAllAsRead = async (
    user_id: number
): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`${ENDPOINTS.NOTI}/read-all`, {
        user_id: user_id
    });
    return response.data;
};