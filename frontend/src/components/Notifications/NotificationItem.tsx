import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../ui/Avatar/Avatar";
import {
    HeartFilledIcon,
    CommentIcon,
    UserPlusIcon,
    UserCheckIcon,
    InfoIcon,
} from "../ui/Icons";
import { NotificationType } from "../../types/notification";
import type { Notification } from "../../types/notification";

interface NotificationItemProps {
    notification: Notification;
    onClick?: () => void;
    /** How many actors in the group (for LIKE/COMMENT grouping). Default = 1 */
    actorCount?: number;
    /** Name of the 2nd actor in the group if actorCount > 1 */
    secondActorName?: string;
    /** Whether any notification in the group is unread */
    hasUnread?: boolean;
}

const getTimeAgo = (dateString?: string): string => {
    if (!dateString) return "Mới đây";
    
    // Ensure ISO format for Safari compatibility and preserve 'Z' for UTC
    let formattedString = dateString.replace(" ", "T");
    if (!formattedString.endsWith("Z") && !formattedString.includes("+")) {
        formattedString += "Z";
    }
    const date = new Date(formattedString);

    if (isNaN(date.getTime())) {
        return "Gần đây"; // Fallback if still invalid
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1 || diffMs < 0) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
};

export const inferType = (notification: Notification): NotificationType => {
    const n = notification as any;
    if (n.type) return n.type as NotificationType;
    
    if (notification.message) {
        const msg = notification.message.toLowerCase();
        if (msg.includes("thích")) return NotificationType.LIKE;
        if (msg.includes("bình luận")) return NotificationType.COMMENT;
        if (msg.includes("trả lời")) return NotificationType.REPLY;
        if (msg.includes("kết bạn")) return NotificationType.FRIEND_REQ;
        if (msg.includes("chấp nhận")) return NotificationType.FRIEND_ACCEPT;
    }
    return NotificationType.SYSTEM;
};

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case "LIKE":
            return { icon: <HeartFilledIcon size={12} />, className: "like" };
        case "COMMENT":
            return { icon: <CommentIcon size={12} />, className: "comment" };
        case "REPLY":
            return { icon: <CommentIcon size={12} />, className: "reply" };
        case "FRIEND_REQ":
            return { icon: <UserPlusIcon size={12} />, className: "friend-request" };
        case "FRIEND_ACCEPT":
            return { icon: <UserCheckIcon size={12} />, className: "friend-accept" };
        case "SYSTEM":
            return { icon: <InfoIcon size={12} />, className: "system" };
        default:
            return { icon: <InfoIcon size={12} />, className: "system" };
    }
};

const getNotificationLink = (notification: Notification): string => {
    const n = notification as any;
    const type = inferType(notification);
    const entityId = n.entityId || n.entity_id;
    const actorId = n.actorId || n.actor_id;

    switch (type) {
        case "LIKE":
        case "COMMENT":
        case "REPLY":
            return entityId ? `/posts/${entityId}` : "/notifications";
        case "FRIEND_REQ":
        case "FRIEND_ACCEPT":
            return actorId ? `/profile/${actorId}` : "/notifications";
        case "SYSTEM":
        default:
            return "/notifications";
    }
};

/** Build a smart actor label e.g. "A", "A và B", "A, B và 3 người khác" */
const buildActorLabel = (
    primaryName: string,
    secondName: string | undefined,
    total: number
): string => {
    if (total === 1) return primaryName;
    if (total === 2) return `${primaryName} và ${secondName ?? "người khác"}`;
    const others = total - 2;
    return `${primaryName}, ${secondName ?? "người khác"} và ${others} người khác`;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onClick,
    actorCount = 1,
    secondActorName,
    hasUnread,
}) => {
    const type = inferType(notification);
    const { icon, className } = getNotificationIcon(type);
    const link = getNotificationLink(notification);
    const isUnread = hasUnread !== undefined ? hasUnread : !notification.isRead;

    const handleClick = () => {
        if (onClick) onClick();
    };

    const primaryActorName = notification.actor
        ? `${notification.actor.lastName} ${notification.actor.firstName}`.trim()
        : "Hệ thống";

    const actorLabel = buildActorLabel(primaryActorName, secondActorName, actorCount);
    const displayDate = notification.createdAt || (notification as any).created_at;

    return (
        <li className={`notification-item ${isUnread ? "unread" : ""}`}>
            <Link 
                to={link} 
                className="notification-item-link" 
                onClick={handleClick}
            >
                <div className="notification-avatar">
                    <Avatar
                        src={notification.actor?.avatar}
                        alt={primaryActorName}
                        width={48}
                        height={48}
                    >
                        {!notification.actor?.avatar && primaryActorName.charAt(0)}
                    </Avatar>
                    <div className={`notification-type-icon ${className}`}>{icon}</div>
                </div>
                <div className="notification-content">
                    <p className="notification-message">
                        <span className="actor-name">{actorLabel}</span>{" "}
                        {notification.message}
                    </p>
                    <span className="notification-time">{getTimeAgo(displayDate)}</span>
                </div>
                {isUnread && <div className="notification-unread-dot" />}
            </Link>
        </li>
    );
};

export default NotificationItem;
