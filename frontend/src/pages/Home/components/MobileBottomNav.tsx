import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, ChatIcon, PersonIcon, BookmarkIcon } from "../../../components/ui";
import "./MobileBottomNav.css";

const MobileBottomNav: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { icon: <HomeIcon size={24} />, label: "Trang chủ", path: "/" },
        { icon: <ChatIcon size={24} />, label: "Tin nhắn", path: "/messages" },
        { icon: <BookmarkIcon size={24} />, label: "Thông báo", path: "/notifications" },
        { icon: <PersonIcon size={24} />, label: "Hồ sơ", path: "/profile" },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="mobile-bottom-nav">
            {navItems.map((item, index) => (
                <Link
                    key={index}
                    to={item.path}
                    className={`mobile-nav-item ${isActive(item.path) ? "active" : ""}`}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                </Link>
            ))}
        </nav>
    );
};

export default MobileBottomNav;
