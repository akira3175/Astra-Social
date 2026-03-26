import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "../ui/IconButton";
import { BellIcon } from "../ui/Icons";
import { Badge } from "../ui/Badge/Badge";
import NotificationItem, { inferType } from "./NotificationItem";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
} from "../../services/notificationService";
import type { Notification } from "../../types/notification";
import { useCurrentUser } from "../../context/currentUserContext";
import "./NotificationDropdown.css";

/** Group LIKE/COMMENT/REPLY by (type, entityId) so we can show
 *  "A, B and N others liked your post" compactly.
 */
interface GroupedNotification {
    key: string;
    latest: Notification;
    actors: Notification[];
    hasUnread: boolean;
}

function groupNotifications(notifications: Notification[]): GroupedNotification[] {
    const GROUPABLE = new Set(["LIKE", "COMMENT", "REPLY"]);
    const map = new Map<string, GroupedNotification>();
    const order: string[] = [];

    for (const n of notifications) {
        const anyN = n as any;
        const type = inferType(n);
        const entityId = anyN.entityId || anyN.entity_id;
        const isRead = anyN.isRead !== undefined ? anyN.isRead : anyN.is_read;

        if (GROUPABLE.has(type)) {
            const key = `${type}__${entityId}`;
            if (!map.has(key)) {
                map.set(key, { key, latest: n, actors: [], hasUnread: false });
                order.push(key);
            }
            const g = map.get(key)!;
            g.actors.push(n);
            if (!isRead) g.hasUnread = true;
        } else {
            const key = `solo__${anyN.id}`;
            map.set(key, { key, latest: n, actors: [n], hasUnread: !isRead });
            order.push(key);
        }
    }

    return order.map(k => map.get(k)!);
}

const NotificationDropdown: React.FC = () => {
    const { currentUser } = useCurrentUser() ?? {};
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch unread count on mount
    useEffect(() => {
        if (!currentUser) return;

        const fetchUnreadCount = async () => {
            try {
                const response = await getUnreadCount(Number(currentUser.id), false);
                if (response.success) {
                    setUnreadCount(response.count ?? 0);
                }
            } catch (error) {
                console.error("Error fetching unread count:", error);
            }
        };
        fetchUnreadCount();
    }, [currentUser]);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            const fetchNotifications = async () => {
                setIsLoading(true);
                try {
                    const response = await getNotifications(Number(currentUser?.id), 1, 10);
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
    }, [isOpen]);

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



    const handleMarkAllAsRead = async () => {
        if (!currentUser?.id) return;
        try {
            await markAllAsRead(Number(currentUser.id));
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
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
                                {groupNotifications(notifications).map((group) => (
                                    <NotificationItem
                                        key={group.key}
                                        notification={group.latest}
                                        actorCount={group.actors.length}
                                        secondActorName={
                                            group.actors.length > 1
                                                ? `${group.actors[1].actor?.lastName ?? ""} ${group.actors[1].actor?.firstName ?? ""}`.trim()
                                                : undefined
                                        }
                                        hasUnread={group.hasUnread}
                                        onClick={() => {
                                            // Mark all unread in the group
                                            group.actors
                                                .filter(n => {
                                                    const anyN = n as any;
                                                    const isRead = anyN.isRead !== undefined ? anyN.isRead : anyN.is_read;
                                                    return !isRead;
                                                })
                                                .forEach(n => markAsRead(n.id));
                                            
                                            setNotifications(prev =>
                                                prev.map(n => {
                                                    const isRelevant = group.actors.some(a => a.id === n.id);
                                                    if (isRelevant) {
                                                        // Update both potential keys
                                                        const updated = { ...n, isRead: true } as any;
                                                        if ('is_read' in updated) updated.is_read = true;
                                                        return updated;
                                                    }
                                                    return n;
                                                })
                                            );
                                            
                                            const unreadInGroup = group.actors.filter(n => {
                                                const anyN = n as any;
                                                const isRead = anyN.isRead !== undefined ? anyN.isRead : anyN.is_read;
                                                return !isRead;
                                            }).length;
                                            
                                            setUnreadCount(prev => Math.max(0, prev - unreadInGroup));
                                            
                                            // Close dropdown with a slight delay to allow Link to process
                                            setTimeout(() => setIsOpen(false), 50);
                                        }}
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
