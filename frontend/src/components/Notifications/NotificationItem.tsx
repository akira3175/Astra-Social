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
import type { Notification, NotificationType } from "../../types/notification";

interface NotificationItemProps {
    notification: Notification;
    onClick?: (notification: Notification) => void;
}

const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
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
    switch (notification.type) {
        case "LIKE":
        case "COMMENT":
            return `/post/${notification.entityId}`;
        case "REPLY":
            return `/post/${notification.entityId}`;
        case "FRIEND_REQ":
        case "FRIEND_ACCEPT":
            return `/profile/${notification.actorId}`;
        case "SYSTEM":
        default:
            return "/notifications";
    }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
    const { icon, className } = getNotificationIcon(notification.type as NotificationType);
    const link = getNotificationLink(notification);

    const handleClick = () => {
        if (onClick) {
            onClick(notification);
        }
    };

    const actorName = notification.actor
        ? `${notification.actor.firstName} ${notification.actor.lastName}`
        : "Hệ thống";

    return (
        <li
            className={`notification-item ${!notification.isRead ? "unread" : ""}`}
            onClick={handleClick}
        >
            <Link to={link} className="notification-item-link" style={{ display: "contents" }}>
                <div className="notification-avatar">
                    <Avatar
                        src={notification.actor?.avatar}
                        alt={actorName}
                        width={48}
                        height={48}
                    >
                        {!notification.actor?.avatar && actorName.charAt(0)}
                    </Avatar>
                    <div className={`notification-type-icon ${className}`}>{icon}</div>
                </div>
                <div className="notification-content">
                    <p className="notification-message">
                        <span className="actor-name">{actorName}</span> {notification.message}
                    </p>
                    <span className="notification-time">{getTimeAgo(notification.createdAt)}</span>
                </div>
                {!notification.isRead && <div className="notification-unread-dot" />}
            </Link>
        </li>
    );
};

export default NotificationItem;
