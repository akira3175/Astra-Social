import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserProfileApiResponse } from "../types/user";

interface ProtectedRouteProps {
  user: User | null;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, role }) => {
  console.log(user);
  console.log(role);
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.username !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;