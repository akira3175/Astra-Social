import { api } from "../configs/api";
import type {
    NotificationsResponse,
    UnreadCountResponse,
    Notification,
    NotificationType,
    EntityType,
} from "../types/notification";

const ENDPOINTS = {
    NOTI : "/noti",
};

type RawNotification = {
    id: number | string;
    type?: NotificationType;
    actor_id?: number | string;
    actorId?: number | string;
    receiver_id?: number | string;
    receiverId?: number | string;
    entity_type?: EntityType | string;
    entityType?: EntityType | string;
    entity_id?: number | string;
    entityId?: number | string;
    message: string;
    is_read?: boolean;
    isRead?: boolean;
    created_at?: string;
    createdAt?: string;
    actor?: {
        id: number | string;
        username: string;
        email?: string;
        is_verified?: boolean;
        profile?: {
            first_name?: string | null;
            last_name?: string | null;
            avatar_url?: string | null;
        } | null;
    };
};

const inferNotificationType = (raw: RawNotification): NotificationType => {
    if (raw.type) {
        return raw.type;
    }

    const entityType = String(raw.entity_type ?? raw.entityType ?? "").toUpperCase();
    const message = String(raw.message ?? "").toLowerCase();

    if (entityType === "FRIEND") {
        return message.includes("chấp nhận") ? "FRIEND_ACCEPT" : "FRIEND_REQ";
    }

    if (entityType === "COMMENT") {
        return message.includes("trả lời") ? "REPLY" : "COMMENT";
    }

    if (entityType === "POST") {
        return message.includes("thích") ? "LIKE" : "COMMENT";
    }

    return "SYSTEM";
};

const normalizeNotification = (raw: RawNotification): Notification => ({
    id: raw.id,
    type: inferNotificationType(raw),
    actorId: raw.actorId ?? raw.actor_id ?? "",
    receiverId: raw.receiverId ?? raw.receiver_id ?? "",
    entityType: (raw.entityType ?? raw.entity_type ?? "SYSTEM") as EntityType,
    entityId: raw.entityId ?? raw.entity_id ?? "",
    message: raw.message,
    isRead: Boolean(raw.isRead ?? raw.is_read),
    createdAt: raw.createdAt ?? raw.created_at ?? "",
    actor: raw.actor
        ? {
            id: String(raw.actor.id),
            role: null,
            email: raw.actor.email ?? "",
            username: raw.actor.username,
            firstName: raw.actor.profile?.first_name || "",
            lastName: raw.actor.profile?.last_name || "",
            avatar: raw.actor.profile?.avatar_url || undefined,
            isVerified: raw.actor.is_verified ?? false,
        }
        : undefined,
});

export const getNotifications = async (
    user_id: number,
    page: number = 1,
    limit: number = 10
): Promise<NotificationsResponse> => {
    const response = await api.get<{
        success: boolean;
        data: RawNotification[];
        meta?: {
            current_page?: number;
            last_page?: number;
            total?: number;
            currentPage?: number;
            lastPage?: number;
        };
    }>(ENDPOINTS.NOTI, {
        params: {
            user_id: user_id,
            page: page,
            limit: limit,
        }
    });

    return {
        success: response.data.success,
        data: (response.data.data || []).map(normalizeNotification),
        meta: response.data.meta
            ? {
                currentPage: response.data.meta.currentPage ?? response.data.meta.current_page ?? page,
                lastPage: response.data.meta.lastPage ?? response.data.meta.last_page ?? page,
                total: response.data.meta.total ?? 0,
            }
            : undefined,
    };
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
