import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    HomeIcon,
    ChatIcon,
    SettingsIcon,
    PersonIcon,
    BookmarkIcon,
    GroupIcon,
    SearchIcon,
} from "../../../components/ui";
import "./LeftSidebar.css";
import { useCurrentUser } from "../../../context/currentUserContext";
import { useNotificationPolling } from "../../../hooks/useNotificationPolling";

interface MenuItem {
    text: string;
    icon: React.ReactNode;
    path: string;
    badge?: number;
}

interface LeftSidebarProps {
    className?: string;
    onToggleChat: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ className }) => {
    const location = useLocation();
    const { currentUser } = useCurrentUser() ?? {};

    // Real-time notification polling
    const userId = currentUser?.id ? Number(currentUser.id) : null;
    const { unreadCount } = useNotificationPolling(userId);

    // Same permission check as PermissionRoute in App.jsx
    const hasAdminAccess = currentUser?.role?.permissions?.some(
        (p: { group: string }) => p.group.toLowerCase() === "dashboard"
    ) ?? false;

    const mainMenuItems: MenuItem[] = [
        { text: "Trang chủ", icon: <HomeIcon size={22} />, path: "/" },
        { text: "Tìm kiếm", icon: <SearchIcon size={22} />, path: "/search" },
        { text: "Thông báo", icon: <BookmarkIcon size={22} />, path: "/notifications", badge: unreadCount },
        { text: "Tin nhắn", icon: <ChatIcon size={22} />, path: "/messages" },
        { text: "Bạn bè", icon: <GroupIcon size={22} />, path: "/friends" },
        { text: "Hồ sơ", icon: <PersonIcon size={22} />, path: `/profile/${currentUser?.id}` },
        { text: "Cài đặt", icon: <SettingsIcon size={22} />, path: "/settings" },
    ];

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

    return (
        <div className={`left-sidebar ${className || ""}`}>
            <nav>
                {mainMenuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`sidebar-menu-item ${isActive(item.path) && item.path !== "/" ? "active" : location.pathname === "/" && item.path === "/" ? "active" : ""}`}
                    >
                        <span className="menu-icon">
                            {item.icon}
                            {item.badge && item.badge > 0 && (
                                <span className="menu-badge">{item.badge > 99 ? "99+" : item.badge}</span>
                            )}
                        </span>
                        <span>{item.text}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-divider" />

            {hasAdminAccess && (
                <Link to="/admin/dashboard" className="create-post-btn">
                    <span>🛡️</span>
                    <span>Dashboard</span>
                </Link>
            )}

            <div className="sidebar-divider" />
        </div>
    );
};

export default LeftSidebar;

