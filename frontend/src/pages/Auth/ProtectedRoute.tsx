import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserProfileApiResponse } from "../types/user";

interface ProtectedRouteProps {
  isLoading: boolean;
  user: User | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, isLoading }) => {
  if (isLoading)
    return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const allowed = ['admin', 'dev', 'mod'];
  
  if (allowed.includes(user.role.name.toLowerCase())) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;