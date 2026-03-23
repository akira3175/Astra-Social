import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { User } from "../../types/user";

interface GuestRouteProps {
    user: User | null;
    isLoading: boolean;
}

/**
 * GuestRoute - Chỉ cho phép truy cập khi CHƯA đăng nhập.
 * Nếu đã đăng nhập → chuyển về trang chủ.
 */
const GuestRoute: React.FC<GuestRouteProps> = ({ user, isLoading }) => {
    if (isLoading) return null; // Chờ xác thực xong

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default GuestRoute;
