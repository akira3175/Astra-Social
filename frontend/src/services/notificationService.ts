import { api } from "../configs/api";
import type {
    Notification,
    NotificationsResponse,
    UnreadCountResponse,
    NotificationType,
    EntityType,
} from "../types/notification";

// Mock data for development (backend không có API notifications)
const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "LIKE" as NotificationType,
        actorId: "2",
        receiverId: "1",
        entityType: "POST" as EntityType,
        entityId: "101",
        message: "đã thích bài viết của bạn",
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 phút trước
        actor: {
            id: "2",
            username: "nguyenvana",
            firstName: "Nguyễn",
            lastName: "Văn A",
            email: "nguyenvana@example.com",
            avatar: "https://i.pravatar.cc/150?img=1",
        },
    },
    {
        id: "2",
        type: "COMMENT" as NotificationType,
        actorId: "3",
        receiverId: "1",
        entityType: "POST" as EntityType,
        entityId: "101",
        message: "đã bình luận về bài viết của bạn",
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 phút trước
        actor: {
            id: "3",
            username: "tranthib",
            firstName: "Trần",
            lastName: "Thị B",
            email: "tranthib@example.com",
            avatar: "https://i.pravatar.cc/150?img=2",
        },
    },
    {
        id: "3",
        type: "FRIEND_REQ" as NotificationType,
        actorId: "4",
        receiverId: "1",
        entityType: "USER" as EntityType,
        entityId: "4",
        message: "đã gửi lời mời kết bạn",
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
        actor: {
            id: "4",
            username: "levanc",
            firstName: "Lê",
            lastName: "Văn C",
            email: "levanc@example.com",
            avatar: "https://i.pravatar.cc/150?img=3",
        },
    },
    {
        id: "4",
        type: "FRIEND_ACCEPT" as NotificationType,
        actorId: "5",
        receiverId: "1",
        entityType: "USER" as EntityType,
        entityId: "5",
        message: "đã chấp nhận lời mời kết bạn của bạn",
        isRead: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
        actor: {
            id: "5",
            username: "phamthid",
            firstName: "Phạm",
            lastName: "Thị D",
            email: "phamthid@example.com",
            avatar: "https://i.pravatar.cc/150?img=4",
        },
    },
    {
        id: "5",
        type: "REPLY" as NotificationType,
        actorId: "6",
        receiverId: "1",
        entityType: "COMMENT" as EntityType,
        entityId: "201",
        message: "đã trả lời bình luận của bạn",
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày trước
        actor: {
            id: "6",
            username: "hoangvane",
            firstName: "Hoàng",
            lastName: "Văn E",
            email: "hoangvane@example.com",
            avatar: "https://i.pravatar.cc/150?img=5",
        },
    },
    {
        id: "6",
        type: "SYSTEM" as NotificationType,
        actorId: "0",
        receiverId: "1",
        entityType: "USER" as EntityType,
        entityId: "1",
        message: "Chào mừng bạn đến với AstraSocial! Hãy bắt đầu kết nối với bạn bè.",
        isRead: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 tuần trước
        actor: undefined,
    },
];

// Flag để sử dụng mock data
const USE_MOCK = true;

export const getNotifications = async (
    page: number = 1,
    limit: number = 10
): Promise<NotificationsResponse> => {
    if (USE_MOCK) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = mockNotifications.slice(start, end);
        return {
            success: true,
            data,
            meta: {
                currentPage: page,
                lastPage: Math.ceil(mockNotifications.length / limit),
                total: mockNotifications.length,
            },
        };
    }

    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
};

export const markAsRead = async (notificationId: string): Promise<{ success: boolean }> => {
    if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const notification = mockNotifications.find((n) => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
        }
        return { success: true };
    }

    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
};

export const markAllAsRead = async (): Promise<{ success: boolean }> => {
    if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        mockNotifications.forEach((n) => (n.isRead = true));
        return { success: true };
    }

    const response = await api.patch("/notifications/read-all");
    return response.data;
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
    if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const count = mockNotifications.filter((n) => !n.isRead).length;
        return { success: true, count };
    }

    const response = await api.get("/notifications/unread-count");
    return response.data;
};
