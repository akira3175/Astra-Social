import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
    DashboardIcon,
    FileTextIcon,
    CommentIcon,
    FlagIcon,
    HomeIcon,
    MenuIcon,
    CloseIcon,
    SettingsIcon,
    PersonIcon,
} from "../../../components/ui";
import "./AdminLayout.css";

const navItems = [
    { path: "/admin", label: "Tổng quan", icon: DashboardIcon, exact: true },
    { path: "/admin/users", label: "Quản lý người dùng", icon: PersonIcon },
    { path: "/admin/posts", label: "Quản lý bài viết", icon: FileTextIcon },
    { path: "/admin/comments", label: "Quản lý bình luận", icon: CommentIcon },
    { path: "/admin/reports", label: "Báo cáo vi phạm", icon: FlagIcon, badge: true },
    { path: "/admin/roles", label: "Phân quyền", icon: SettingsIcon },
];

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const today = new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const getPageTitle = () => {
        if (location.pathname === "/admin") return "Tổng quan";
        if (location.pathname === "/admin/users") return "Quản lý người dùng";
        if (location.pathname === "/admin/posts") return "Quản lý bài viết";
        if (location.pathname === "/admin/comments") return "Quản lý bình luận";
        if (location.pathname === "/admin/reports") return "Báo cáo vi phạm";
        if (location.pathname === "/admin/roles") return "Phân quyền";
        return "Admin";
    };

    return (
        <div className="admin-layout">
            {/* Overlay for mobile */}
            <div
                className={`admin-overlay ${sidebarOpen ? "open" : ""}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-logo">A</div>
                    <div className="admin-logo-text">
                        <span className="admin-logo-title">Astra Social</span>
                        <span className="admin-logo-subtitle">Admin Panel</span>
                    </div>
                    <button
                        className="admin-mobile-toggle"
                        onClick={() => setSidebarOpen(false)}
                        style={{ marginLeft: "auto", color: "#94a3b8" }}
                    >
                        <CloseIcon size={20} />
                    </button>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) =>
                                `admin-nav-item ${isActive ? "active" : ""}`
                            }
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon size={20} className="admin-nav-icon" />
                            <span className="admin-nav-label">{item.label}</span>
                            {item.badge && (
                                <span className="admin-nav-badge">7</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-avatar">AD</div>
                    <div className="admin-user-info">
                        <div className="admin-user-name">Admin User</div>
                        <div className="admin-user-role">Administrator</div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <button
                            className="admin-mobile-toggle"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <MenuIcon size={24} />
                        </button>
                        <h1 className="admin-topbar-title">{getPageTitle()}</h1>
                    </div>
                    <div className="admin-topbar-right">
                        <span className="admin-topbar-date">{today}</span>
                        <NavLink to="/" className="admin-back-link">
                            <HomeIcon size={16} />
                            Về trang chủ
                        </NavLink>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
