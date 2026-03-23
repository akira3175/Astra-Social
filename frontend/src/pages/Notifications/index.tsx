import React, { useState, useEffect, useCallback } from "react";
import NotificationItem from "../../components/Notifications/NotificationItem";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from "../../services/notificationService";
import { useCurrentUser } from "../../context/currentUserContext";
import type { Notification } from "../../types/notification";
import "./NotificationsPage.css";

type TabType = "all" | "unread";

const NotificationsPage: React.FC = () => {
    const { currentUser } = useCurrentUser() ?? {};
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const fetchNotifications = useCallback(async (pageNum: number, reset: boolean = false) => {
        if (!currentUser?.id) return;
        
        try {
            if (reset) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }

            const response = await getNotifications(Number(currentUser.id), pageNum, 10);
            
            if (response.success) {
                const newData = Array.isArray(response.data) ? response.data : (response.data as any).data;
                
                setNotifications((prev) =>
                    reset ? newData : [...prev, ...newData]
                );
                if (response.meta) {
                    setHasMore(pageNum < response.meta.lastPage);
                } else {
                    setHasMore(newData.length === 10);
                }
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [currentUser?.id]);

    useEffect(() => {
        if (currentUser?.id) {
            fetchNotifications(1, true);
            setPage(1);
        }
    }, [fetchNotifications, currentUser?.id]);

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            try {
                const res = await markAsRead(notification.id);
                if (res.success) {
                    setNotifications((prev) =>
                        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
                    );
                }
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!currentUser?.id) return;
        try {
            const res = await markAllAsRead(Number(currentUser.id));
            if (res.success) {
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchNotifications(nextPage, false);
    };

    // Filter dữ liệu cho các Tab
    const filteredNotifications =
        activeTab === "unread"
            ? notifications.filter((n) => !n.isRead)
            : notifications;

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <h1>Thông báo</h1>
                {unreadCount > 0 && (
                    <button
                        className="notifications-mark-all-btn"
                        onClick={handleMarkAllAsRead}
                    >
                        Đánh dấu tất cả đã đọc
                    </button>
                )}
            </div>

            <div className="notifications-tabs">
                <button
                    className={`notifications-tab ${activeTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveTab("all")}
                >
                    Tất cả
                    <span className="notifications-tab-count">{notifications.length}</span>
                </button>
                <button
                    className={`notifications-tab ${activeTab === "unread" ? "active" : ""}`}
                    onClick={() => setActiveTab("unread")}
                >
                    Chưa đọc
                    <span className="notifications-tab-count">{unreadCount}</span>
                </button>
            </div>

            <div className="notifications-content">
                {isLoading ? (
                    <div className="notifications-loading">
                        <div className="notifications-loading-spinner" />
                        <p>Đang tải thông báo...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="notifications-empty">
                        <div className="notifications-empty-icon">🔔</div>
                        <h3>
                            {activeTab === "unread"
                                ? "Không có thông báo chưa đọc"
                                : "Không có thông báo nào"}
                        </h3>
                        <p>
                            {activeTab === "unread"
                                ? "Bạn đã đọc hết tất cả thông báo!"
                                : "Các thông báo mới sẽ xuất hiện ở đây"}
                        </p>
                    </div>
                ) : (
                    <>
                        <ul className="notifications-list">
                            {filteredNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onClick={() => handleNotificationClick(notification)}
                                />
                            ))}
                        </ul>
                        {hasMore && activeTab === "all" && (
                            <div className="notifications-load-more">
                                <button
                                    className="notifications-load-more-btn"
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore ? "Đang tải..." : "Xem thêm"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;