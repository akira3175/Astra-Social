import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "../ui/IconButton";
import { BellIcon } from "../ui/Icons";
import { Badge } from "../ui/Badge/Badge";
import NotificationItem from "./NotificationItem";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from "../../services/notificationService";
import type { Notification } from "../../types/notification";
import { useCurrentUser } from "../../context/currentUserContext";
import { useNotificationPolling } from "../../hooks/useNotificationPolling";
import "./NotificationDropdown.css";

const NotificationDropdown: React.FC = () => {
    const { currentUser } = useCurrentUser() ?? {};
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const userId = currentUser?.id ? Number(currentUser.id) : null;
    const { unreadCount, refresh } = useNotificationPolling(userId);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (isOpen && userId) {
            const fetchNotifications = async () => {
                setIsLoading(true);
                try {
                    const response = await getNotifications(userId, 1, 10);
                    if (response.success) {
                        setNotifications(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchNotifications();
        }
    }, [isOpen, userId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            try {
                await markAsRead(notification.id);
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
                );
                refresh();
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        }
        setIsOpen(false);
    };

    const handleMarkAllAsRead = async () => {
        if (!currentUser?.id) return;
        try {
            await markAllAsRead(Number(currentUser.id));
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            refresh();
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    return (
        <div className="notification-dropdown-wrapper" ref={dropdownRef}>
            <IconButton onClick={handleToggle} aria-label="Thông báo">
                <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0}>
                    <BellIcon />
                </Badge>
            </IconButton>

            {isOpen && (
                <div className="notification-panel">
                    <div className="notification-panel-header">
                        <h3>Thông báo</h3>
                        {unreadCount > 0 && (
                            <button
                                className="notification-mark-all-btn"
                                onClick={handleMarkAllAsRead}
                            >
                                Đánh dấu đã đọc
                            </button>
                        )}
                    </div>

                    <div className="notification-panel-body">
                        {isLoading ? (
                            <div className="notification-loading">
                                <p>Đang tải...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="notification-empty">
                                <div className="notification-empty-icon">🔔</div>
                                <p>Không có thông báo nào</p>
                            </div>
                        ) : (
                            <ul className="notification-list">
                                {notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onClick={handleNotificationClick}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="notification-panel-footer">
                        <Link
                            to="/notifications"
                            className="notification-view-all-link"
                            onClick={() => setIsOpen(false)}
                        >
                            Xem tất cả thông báo
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
