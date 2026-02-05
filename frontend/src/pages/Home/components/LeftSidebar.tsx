import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    HomeIcon,
    ChatIcon,
    SettingsIcon,
    PersonIcon,
    BookmarkIcon,
    GroupIcon,
} from "../../../components/ui";
import "./LeftSidebar.css";
import { useCurrentUser } from "../../../context/currentUserContext";

interface MenuItem {
    text: string;
    icon: React.ReactNode;
    path: string;
}

interface LeftSidebarProps {
    className?: string;
    onToggleChat: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ className }) => {
    const location = useLocation();
    const { currentUser } = useCurrentUser() ?? {};

    const mainMenuItems: MenuItem[] = [
        { text: "Trang chủ", icon: <HomeIcon size={22} />, path: "/" },
        { text: "Thông báo", icon: <BookmarkIcon size={22} />, path: "/notifications" },
        { text: "Tin nhắn", icon: <ChatIcon size={22} />, path: "/messages" },
        { text: "Bạn bè", icon: <GroupIcon size={22} />, path: "/friends" },
        { text: "Hồ sơ", icon: <PersonIcon size={22} />, path: `/profile/${currentUser?.id}` },
        { text: "Cài đặt", icon: <SettingsIcon size={22} />, path: "/settings" },
    ];

    const additionalMenuItems: MenuItem[] = [
        { text: "Nhóm", icon: <GroupIcon size={22} />, path: "/groups" },
        { text: "Sự kiện", icon: <BookmarkIcon size={22} />, path: "/events" },
        { text: "Đã lưu", icon: <BookmarkIcon size={22} />, path: "/saved" },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className={`left-sidebar ${className || ""}`}>
            <nav>
                {mainMenuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`sidebar-menu-item ${isActive(item.path) ? "active" : ""}`}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span>{item.text}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-divider" />

            <button className="create-post-btn">
                <span>✏️</span>
                <span>Tạo bài viết</span>
            </button>

            <div className="sidebar-divider" />

            <div className="sidebar-section-title">Khám phá</div>
            <nav>
                {additionalMenuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`sidebar-menu-item ${isActive(item.path) ? "active" : ""}`}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span>{item.text}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default LeftSidebar;
