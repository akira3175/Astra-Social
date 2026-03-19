import type { User } from "./user";

export enum NotificationType {
    LIKE = "LIKE",
    COMMENT = "COMMENT",
    REPLY = "REPLY",
    FRIEND_REQ = "FRIEND_REQ",
    FRIEND_ACCEPT = "FRIEND_ACCEPT",
    SYSTEM = "SYSTEM",
}

export enum EntityType {
    POST = "POST",
    COMMENT = "COMMENT",
    USER = "USER",
}

export interface Notification {
    id: string;
    type: NotificationType;
    actorId: string;
    receiverId: string;
    entityType: EntityType;
    entityId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    actor?: User;
}

export interface NotificationsResponse {
    success: boolean;
    data: Notification[];
    meta?: {
        currentPage: number;
        lastPage: number;
        total: number;
    };
}

export interface UnreadCountResponse {
    success: boolean;
    count: number;
}
