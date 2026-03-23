import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { User } from "../../types/user";

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
  
  if (user.role?.name && allowed.includes(user.role.name.toLowerCase())) {
    return <Outlet />;
  }

  return <Navigate to="/404" replace />;
};

export default ProtectedRoute;